# backend/gemini_service/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, WebSocketState
from fastapi.middleware.cors import CORSMiddleware
# Add Swagger UI imports (if needed, often automatic with FastAPI)
# from fastapi.openapi.utils import get_openapi
# from fastapi.responses import JSONResponse

import os
from dotenv import load_dotenv
from gemini_client import GeminiClient
import json
import asyncio
import logging
from typing import Dict
from datetime import datetime

load_dotenv()

# --- Configuration ---
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEFAULT_VOICE = os.getenv('DEFAULT_VOICE', 'Charon')
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'en-US')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
# Added lovable.dev and potentially other required origins
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000,https://lovable.dev').split(',') 
WS_PING_INTERVAL = int(os.getenv('WS_PING_INTERVAL', 30))
WS_PING_TIMEOUT = int(os.getenv('WS_PING_TIMEOUT', 10))
API_VERSION = "0.1.0" # Define API version

# --- FastAPI App Setup ---
# Add title, version, description for Swagger UI
app = FastAPI(
    title="Gemini WebSocket Service",
    version=API_VERSION,
    description="Provides a WebSocket interface to interact with Google Gemini, including streaming text and TTS audio.",
    # Add tags metadata for better organization in Swagger UI
    openapi_tags=[{
        "name": "WebSocket",
        "description": "Main WebSocket endpoint for Gemini interaction."
    }, {
        "name": "Meta",
        "description": "Service metadata and health checks."
    }]
)

# Configure CORS - Ensure lovable.dev is included
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s' # Consistent format
)
logger = logging.getLogger(__name__)

# Log startup configuration
logger.info(f"Starting Gemini WebSocket Service v{API_VERSION}")
logger.info(f"Host: {HOST}")
logger.info(f"Port: {PORT}")
logger.info(f"Default Voice: {DEFAULT_VOICE}")
logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}")
logger.info(f"WebSocket Settings: Ping Interval={WS_PING_INTERVAL}s, Timeout={WS_PING_TIMEOUT}s")


# --- State Management --- (Simple in-memory, consider alternatives for scaling)
connections: Dict[str, tuple[WebSocket, GeminiClient]] = {} # Store WebSocket and Client
last_activity: Dict[str, float] = {}

# --- API Endpoints ---

# NEW: Version Endpoint
@app.get("/version", tags=["Meta"])
async def get_version():
    """Returns the current version of the API."""
    return {"version": API_VERSION}

# Health Check Endpoint (Updated tag)
@app.get("/health", tags=["Meta"])
async def health_check():
    """Checks if the service is running and the API key is configured."""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            # Log specific error, return 503 Service Unavailable
            logger.error("Health check failed: GOOGLE_API_KEY not configured")
            raise HTTPException(status_code=503, detail="Service Unavailable: GOOGLE_API_KEY not configured")
        # Optional: Add a quick check to the Gemini client/API if feasible without cost/delay
        # Example: try client = GeminiClient(api_key) etc. but be mindful of cost/rate limits
        return {"status": "healthy", "version": API_VERSION, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        logger.error(f"Health check failed unexpectedly: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


# --- WebSocket Logic --- (Tag added for Swagger)
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """Main WebSocket endpoint for Gemini interaction."""
    logger.info(f"New WebSocket connection request from client {client_id}")
    await websocket.accept()
    logger.info(f"WebSocket connection accepted for client {client_id} from {websocket.client.host}:{websocket.client.port}")

    client = None # Initialize client to None for finally block
    try:
        # Add connection count logging
        logger.info(f"Active connections: {len(connections) + 1}")

        # Initialize Gemini client
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            error_msg = "Missing GOOGLE_API_KEY configuration"
            logger.error(error_msg + f" for client {client_id}")
            await websocket.close(code=1008, reason=error_msg) # Use standard code 1008 Policy Violation
            return

        try:
            client = GeminiClient(api_key)
            logger.info(f"GeminiClient instantiated for {client_id}")
            await client.initialize_session(DEFAULT_VOICE, DEFAULT_LANGUAGE)
            logger.info(f"Gemini session initialized for client {client_id}")
        except Exception as init_error:
            error_msg = f"Failed to initialize Gemini session: {init_error}"
            logger.exception(f"{error_msg} for client {client_id}") # Log exception
            await websocket.close(code=1011, reason=error_msg) # Use standard code 1011 Internal Error
            return

        connections[client_id] = (websocket, client) # Store both websocket and client

        # --- Audio Callback --- 
        async def audio_callback(audio_data: bytes):
            try:
                # Check if connection still exists before sending
                if client_id not in connections:
                    logger.warning(f"Audio callback attempted for disconnected client {client_id}")
                    return
                
                ws, _ = connections[client_id]
                if ws.client_state == WebSocketState.CONNECTED:
                    # Send audio marker first
                    await ws.send_json({
                        "type": "audio_chunk_info",
                        "size": len(audio_data),
                        "format": "mp3" # Assuming MP3
                    })
                    # Send raw audio bytes
                    await ws.send_bytes(audio_data)
                    logger.debug(f"Sent audio chunk ({len(audio_data)} bytes) to client {client_id}")
                else:
                     logger.warning(f"WebSocket no longer connected for client {client_id} during audio callback.")
            except WebSocketDisconnect:
                 logger.warning(f"Client {client_id} disconnected during audio send.")
            except Exception as audio_e:
                logger.error(f"Error sending audio data to client {client_id}: {audio_e}", exc_info=True)

        client.set_audio_callback(audio_callback)
        # --- End Audio Callback --- 

        # Update last activity when client connects
        current_time = asyncio.get_event_loop().time()
        last_activity[client_id] = current_time

        # --- Main WebSocket Receive Loop --- 
        while True:
            try:
                # Update last activity timestamp on receive
                current_time = asyncio.get_event_loop().time()
                last_activity[client_id] = current_time

                # Receive message from client with timeout
                try:
                    # Adjusted timeout to be slightly longer than ping interval
                    data = await asyncio.wait_for(websocket.receive_text(), timeout=WS_PING_INTERVAL * 1.5)
                except asyncio.TimeoutError:
                    logger.warning(f"WebSocket receive timeout for client {client_id}. Sending ping.")
                    # Send a ping from server side to check connection
                    try:
                        await websocket.send_json({"type": "server_ping"})
                        # Wait for a potential pong or next message briefly
                        await asyncio.wait_for(websocket.receive_text(), timeout=WS_PING_TIMEOUT)
                        logger.debug(f"Client {client_id} responded after server ping.")
                        # If receive works, update activity and continue loop
                        last_activity[client_id] = asyncio.get_event_loop().time()
                        message = json.loads(data) # Process received data
                        # (Duplicate message processing logic needed here if required after ping)
                    except asyncio.TimeoutError:
                        logger.warning(f"Client {client_id} did not respond after server ping. Closing connection.")
                        break # Exit loop to close connection cleanly
                    except Exception as ping_e:
                         logger.error(f"Error during server ping sequence for {client_id}: {ping_e}")
                         break # Exit loop on error during ping
                    continue # Go to next loop iteration after successful ping sequence

                message = json.loads(data)

                # Handle explicit ping messages from client
                if message.get('type') == 'ping':
                    await websocket.send_json({"type": "pong"})
                    logger.debug(f"Responded to client ping from {client_id}")
                    continue

                logger.info(f"Received message type '{message.get('type', 'unknown')}' from client {client_id}")

                # Process text message
                if message.get("type") == "text_message" and "text" in message:
                    full_response_text = "" 
                    async for response in client.send_message(
                        message["text"],
                        message.get("role", "user"),
                        enable_tts=message.get("enableTTS", True)
                    ):
                        # Check connection state before sending each part
                        if websocket.client_state != WebSocketState.CONNECTED:
                             logger.warning(f"Client {client_id} disconnected during message stream. Aborting send.")
                             break # Stop sending if client disconnected
                        await websocket.send_json(response)
                        if response.get("type") == "text":
                             full_response_text = response.get("content", full_response_text)
                    
                    # Ensure loop didn't break due to disconnection before sending 'complete'
                    if websocket.client_state == WebSocketState.CONNECTED:
                        await websocket.send_json({
                            "type": "complete",
                            "text": full_response_text, 
                            "role": "assistant"
                        })
                # Placeholder for handling settings updates
                elif message.get("type") == "update_settings":
                    logger.info(f"Received settings update from {client_id}: {message.get('settings')}")
                    await websocket.send_json({"type": "settings_ack", "status": "received"})
                else:
                     logger.warning(f"Received unknown message type from {client_id}: {message.get('type')}")
                     await websocket.send_json({"type": "error", "error": f"Unknown message type: {message.get('type')}"})

            # --- Exception Handling for Inner Loop --- 
            except WebSocketDisconnect:
                logger.info(f"Client {client_id} disconnected gracefully.")
                break
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from client {client_id}: {data[:200]}...", exc_info=True) # Log part of invalid data
                try:
                    await websocket.send_json({"type": "error", "error": "Invalid JSON format received"})
                except Exception:
                    pass # Ignore if we can't send error
            except Exception as e:
                logger.exception(f"Error processing message from client {client_id}: {e}") 
                try:
                     # Avoid sending overly detailed internal errors to client
                     await websocket.send_json({"type": "error", "error": "Internal server error during message processing"})
                except Exception:
                     pass # Ignore if we can't send error
                # Consider if certain errors should terminate the connection; often yes
                # break 
        # --- End Main WebSocket Receive Loop --- 

    # --- Exception Handling for Outer Scope (Connection Setup) --- 
    except Exception as e:
        logger.exception(f"Unexpected error in WebSocket handler for client {client_id}: {e}")
    # --- Final Cleanup --- 
    finally:
        logger.info(f"Cleaning up connection for client {client_id}")
        if client_id in connections:
            ws, client_instance = connections.pop(client_id) # Remove and get client
            logger.info(f"Closing Gemini session for client {client_id}")
            if client_instance: # Check if client was successfully initialized
                await client_instance.close()
                logger.info(f"Gemini session closed for {client_id}")
            # Ensure WebSocket is closed from server-side if not already
            if ws.client_state != WebSocketState.DISCONNECTED:
                 logger.warning(f"WebSocket state for {client_id} was {ws.client_state}, attempting close.")
                 try:
                     await ws.close(code=1000)
                 except Exception as close_e:
                     logger.error(f"Error during final WebSocket close for {client_id}: {close_e}")
        if client_id in last_activity:
            del last_activity[client_id]
        logger.info(f"Finished cleanup for client {client_id}. Active connections: {len(connections)}")

# --- Background Task (Refactor needed) ---
# Deprecated: Use lifespan events instead. This task is also potentially inefficient.
# @app.on_event("startup")
# async def startup_event():
#     logger.info("Startup event: Skipping deprecated inactive connection cleanup task setup.")
    # ... (cleanup task code removed for brevity and because loop timeout is preferred)

# --- Lifespan Event Handler (Recommended replacement for on_event) ---
from contextlib import asynccontextmanager

@asynccontextmanager
asyn<ctrl61>c def lifespan(app: FastAPI):
    # Code to run on startup
    logger.info("Lifespan startup: Initializing service...")
    # You could start background tasks here if needed, ensuring they are properly cancelled
    # Example: task = asyncio.create_task(my_background_task())
    yield
    # Code to run on shutdown
    logger.info("Lifespan shutdown: Cleaning up resources...")
    # Example: task.cancel(); await task
    # Close any remaining client sessions gracefully
    logger.info(f"Closing {len(connections)} remaining WebSocket connections and Gemini sessions...")
    for client_id, (ws, client_instance) in list(connections.items()):
        logger.info(f"Closing connection for client {client_id} during shutdown...")
        if client_instance:
            await client_instance.close()
        if ws.client_state != WebSocketState.DISCONNECTED:
            try:
                await ws.close(code=1001) # Going Away
            except Exception: pass
    connections.clear()
    last_activity.clear()
    logger.info("Lifespan shutdown complete.")

# Assign the lifespan context manager to the app
app.router.lifespan_context = lifespan

# --- Run Server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
         "main:app", 
         host=HOST,
         port=PORT,
         log_level=LOG_LEVEL.lower(),
         reload=False 
     )
