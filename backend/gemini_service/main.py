from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from gemini_client import GeminiClient
import json
import asyncio
import logging
from typing import Dict
from datetime import datetime

load_dotenv()

# Configure environment variables with defaults
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEFAULT_VOICE = os.getenv('DEFAULT_VOICE', 'Charon')
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'en-US')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
WS_PING_INTERVAL = int(os.getenv('WS_PING_INTERVAL', 30))
WS_PING_TIMEOUT = int(os.getenv('WS_PING_TIMEOUT', 10))

app = FastAPI()

# Configure CORS
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
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Log startup configuration
logger.info(f"Starting server with configuration:")
logger.info(f"Host: {HOST}")
logger.info(f"Port: {PORT}")
logger.info(f"Default Voice: {DEFAULT_VOICE}")
logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}")
logger.info(f"WebSocket Settings: Ping Interval={WS_PING_INTERVAL}s, Timeout={WS_PING_TIMEOUT}s")

# Store active connections and their last activity
connections: Dict[str, GeminiClient] = {}
last_activity: Dict[str, float] = {}

# Add health check endpoint
@app.get("/health")
async def health_check():
    try:
        api_key = os.getenv("GOOGLE_API_KEY") # Changed VITE_GEMINI_API_KEY to GOOGLE_API_KEY
        if not api_key:
            raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured")
        return {"status": "healthy", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    logger.info(f"New WebSocket connection request from client {client_id}")
    await websocket.accept()
    logger.info(f"WebSocket connection accepted for client {client_id}")
    
    try:
        # Add connection count logging
        active_connections = len(connections)
        logger.info(f"Active connections: {active_connections + 1}")
        
        # Initialize Gemini client with more detailed error
        api_key = os.getenv("GOOGLE_API_KEY") # Changed VITE_GEMINI_API_KEY to GOOGLE_API_KEY
        if not api_key:
            error_msg = "Missing GOOGLE_API_KEY - Please configure in .env file or environment"
            logger.error(error_msg)
            await websocket.close(code=4000, reason=error_msg)
            return
            
        client = GeminiClient(api_key)
        connections[client_id] = client
        logger.info(f"Initialized Gemini client for {client_id}")
        
        # Set up audio callback
        async def audio_callback(audio_data: bytes):
            try:
                # Send audio chunks with metadata
                await websocket.send_json({
                    "type": "audio_data",
                    "size": len(audio_data),
                    "content_type": "audio/mp3",
                    "format": "mp3"
                })
                
                # Send the actual audio data
                await websocket.send_bytes(audio_data)
                logger.debug(f"Sent audio chunk of {len(audio_data)} bytes to client {client_id}")
            except Exception as e:
                logger.error(f"Error sending audio data to client {client_id}: {e}")
        
        client.set_audio_callback(audio_callback)
        
        # Initialize session with voice settings
        logger.info(f"Initializing Gemini session for client {client_id}")
        await client.initialize_session(DEFAULT_VOICE, DEFAULT_LANGUAGE)
        logger.info(f"Gemini session initialized for client {client_id}")
        
        # Update last activity when client connects
        last_activity[client_id] = asyncio.get_event_loop().time()
        
        # Main WebSocket loop
        while True:
            try:
                # Update last activity timestamp
                last_activity[client_id] = asyncio.get_event_loop().time()
                
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle ping messages
                if message.get('type') == 'ping':
                    await websocket.send_json({"type": "pong"})
                    continue
                
                logger.info(f"Received message from client {client_id}: {message.get('text', '')[:50]}...")
                
                # Getting full text for response
                full_response_text = ""
                
                # Stream responses from the new streaming Gemini client
                async for response in client.send_message(
                    message["text"],
                    message.get("role", "user"),
                    enable_tts=message.get("enableTTS", True)
                ):
                    if response["type"] == "error":
                        await websocket.send_json({"error": response["error"]})
                    elif response["type"] == "text":
                        # Accumulate the full text response
                        full_response_text = response["content"]
                        await websocket.send_json(response)
                    else:
                        await websocket.send_json(response)
                
                # Send final complete response with full text
                if full_response_text:
                    await websocket.send_json({
                        "type": "complete",
                        "text": full_response_text,
                        "role": "assistant"
                    })
                        
            except WebSocketDisconnect:
                logger.info(f"Client {client_id} disconnected")
                break
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from client {client_id}")
                await websocket.send_json({"error": "Invalid message format"})
            except Exception as e:
                logger.error(f"Error processing message from client {client_id}: {e}")
                await websocket.send_json({"error": str(e)})
                
    except Exception as e:
        detailed_error = f"Error type: {type(e).__name__}, Details: {str(e)}"
        logger.error(f"Unexpected error for client {client_id}: {detailed_error}")
        await websocket.send_json({"error": detailed_error})
    finally:
        # Clean up
        if client_id in connections:
            await connections[client_id].close()
            del connections[client_id]
        if client_id in last_activity:
            del last_activity[client_id]
        logger.info(f"Cleaned up connection for client {client_id}")

# Background task to monitor inactive connections
@app.on_event("startup")
async def startup_event():
    async def cleanup_inactive_connections():
        while True:
            try:
                current_time = asyncio.get_event_loop().time()
                inactive_clients = [
                    client_id for client_id, last_time in last_activity.items()
                    if current_time - last_time > WS_PING_TIMEOUT
                ]
                
                for client_id in inactive_clients:
                    logger.info(f"Cleaning up inactive connection: {client_id}")
                    if client_id in connections:
                        await connections[client_id].close()
                        del connections[client_id]
                    if client_id in last_activity:
                        del last_activity[client_id]
                        
                await asyncio.sleep(WS_PING_INTERVAL)
            except Exception as e:
                logger.error(f"Error in cleanup task: {e}")
                await asyncio.sleep(WS_PING_INTERVAL)
    
    asyncio.create_task(cleanup_inactive_connections())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
