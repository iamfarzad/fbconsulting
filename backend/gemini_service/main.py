# backend/gemini_service/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, WebSocketState
from fastapi.middleware.cors import CORSMiddleware
# Pydantic for message validation
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Dict, Any, Tuple
import base64
import json
import asyncio
import logging
import os
from dotenv import load_dotenv
from gemini_client import GeminiClient
from datetime import datetime
from contextlib import asynccontextmanager

load_dotenv()

# --- Configuration ---
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEFAULT_VOICE = os.getenv('DEFAULT_VOICE', 'Charon')
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'en-US')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000,https://lovable.dev').split(',')
WS_PING_INTERVAL = int(os.getenv('WS_PING_INTERVAL', 30))
WS_PING_TIMEOUT = int(os.getenv('WS_PING_TIMEOUT', 10))
API_VERSION = "0.2.0" # Updated version for multimodal support

# --- Pydantic Models for Incoming WebSocket Messages ---
class FileData(BaseModel):
    mime_type: str
    data: str = Field(..., description="Base64 encoded file data") # Base64 encoded data string
    filename: Optional[str] = None

class TextMessage(BaseModel):
    type: str = Field("text_message", Literal=True)
    text: str
    role: str = "user"
    enableTTS: bool = True

class MultimodalMessage(BaseModel):
    type: str = Field("multimodal_message", Literal=True)
    text: Optional[str] = None
    files: List[FileData] = Field(..., min_items=1) # Must have at least one file
    role: str = "user"
    enableTTS: bool = True

# --- FastAPI App Setup ---
app = FastAPI(
    title="Gemini Multimodal WebSocket Service",
    version=API_VERSION,
    description="Provides a WebSocket interface to interact with Google Gemini, supporting text, images, documents, and streaming TTS audio.",
    openapi_tags=[{"name": "WebSocket", "description": "Main WebSocket endpoint"}, {"name": "Meta", "description": "Service metadata"}]
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Setup
logging.basicConfig(level=getattr(logging, LOG_LEVEL.upper()), format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Log Startup Config
logger.info(f"Starting Gemini WebSocket Service v{API_VERSION}")
logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}")
# (Log other configs as needed)

# --- State Management ---
connections: Dict[str, Tuple[WebSocket, GeminiClient]] = {}
last_activity: Dict[str, float] = {}

# --- Lifespan Event Handler ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Lifespan startup: Initializing service...")
    yield
    logger.info("Lifespan shutdown: Cleaning up resources...")
    logger.info(f"Closing {len(connections)} remaining connections...")
    for client_id, (ws, client_instance) in list(connections.items()):
        logger.info(f"Closing connection for client {client_id} during shutdown...")
        if client_instance: await client_instance.close()
        if ws.client_state != WebSocketState.DISCONNECTED:
            try: await ws.close(code=1001) # Going Away
            except Exception: pass
    connections.clear()
    last_activity.clear()
    logger.info("Lifespan shutdown complete.")

app.router.lifespan_context = lifespan

# --- API Endpoints ---
@app.get("/version", tags=["Meta"])
async def get_version():
    return {"version": API_VERSION}

@app.get("/health", tags=["Meta"])
async def health_check():
    if not os.getenv("GOOGLE_API_KEY"):
        logger.error("Health check failed: GOOGLE_API_KEY not configured")
        raise HTTPException(status_code=503, detail="Service Unavailable: GOOGLE_API_KEY not configured")
    return {"status": "healthy", "version": API_VERSION, "timestamp": datetime.now().isoformat()}

# --- WebSocket Endpoint ---
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    logger.info(f"Connection request from client {client_id} @ {websocket.client.host}:{websocket.client.port}")
    await websocket.accept()
    logger.info(f"Connection accepted for {client_id}")

    client = None
    try:
        # --- Client Initialization ---
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            await websocket.close(code=1008, reason="Missing GOOGLE_API_KEY configuration")
            return
        try:
            client = GeminiClient(api_key)
            await client.initialize_session(DEFAULT_VOICE, DEFAULT_LANGUAGE)
            logger.info(f"Gemini session initialized for {client_id}")
        except Exception as init_error:
            logger.exception(f"Gemini initialization failed for {client_id}: {init_error}")
            await websocket.close(code=1011, reason=f"Failed to initialize Gemini session: {init_error}")
            return

        connections[client_id] = (websocket, client)
        logger.info(f"Client {client_id} connected. Active connections: {len(connections)}")

        # --- Audio Callback Setup ---
        async def audio_callback(audio_data: bytes):
             # Simplified - robust error handling needed here too
            if client_id in connections and connections[client_id][0].client_state == WebSocketState.CONNECTED:
                try:
                    ws, _ = connections[client_id]
                    await ws.send_json({"type": "audio_chunk_info", "size": len(audio_data), "format": "mp3"})
                    await ws.send_bytes(audio_data)
                    logger.debug(f"Sent audio chunk ({len(audio_data)} bytes) to {client_id}")
                except Exception as audio_e: logger.error(f"Audio send error for {client_id}: {audio_e}")
            else: logger.warning(f"Audio callback for disconnected client {client_id}")
        client.set_audio_callback(audio_callback)
        # --- End Audio Callback ---

        last_activity[client_id] = asyncio.get_event_loop().time()

        # --- Main Receive Loop ---
        while True:
            response_stream = None # Ensure stream is reset each loop
            try:
                # --- Receive & Timeout Logic ---
                try:
                    raw_data = await asyncio.wait_for(websocket.receive_text(), timeout=WS_PING_INTERVAL * 1.5)
                except asyncio.TimeoutError:
                    logger.warning(f"Receive timeout for {client_id}. Sending server ping.")
                    try:
                        await websocket.send_json({"type": "server_ping"})
                        await asyncio.wait_for(websocket.receive_text(), timeout=WS_PING_TIMEOUT) # Wait for any response (pong or data)
                        last_activity[client_id] = asyncio.get_event_loop().time() # Update activity if client responded
                        logger.debug(f"Client {client_id} responded after server ping.")
                        # Note: If data was received here, it's currently ignored. Refactor needed if processing required.
                        continue # Continue loop after successful ping response
                    except asyncio.TimeoutError:
                        logger.warning(f"{client_id} did not respond after server ping. Closing.")
                        break # Close connection
                    except Exception as ping_e:
                        logger.error(f"Error during server ping for {client_id}: {ping_e}")
                        break # Close connection
                # --- End Receive & Timeout ---

                message_data = json.loads(raw_data)
                message_type = message_data.get("type")
                last_activity[client_id] = asyncio.get_event_loop().time()

                # --- Message Processing ---
                if message_type == 'ping':
                    await websocket.send_json({"type": "pong"})
                    continue

                logger.info(f"Received type '{message_type}' from {client_id}")

                if message_type == "text_message":
                    try:
                        message = TextMessage.model_validate(message_data)
                        response_stream = client.send_message(message.text, role=message.role, enable_tts=message.enableTTS, files_data=None)
                    except ValidationError as e:
                        logger.error(f"Invalid text_message from {client_id}: {e}")
                        await websocket.send_json({"type": "error", "error": f"Invalid message format: {e}"})
                        continue

                elif message_type == "multimodal_message":
                    try:
                        message = MultimodalMessage.model_validate(message_data)
                        processed_files = []
                        for file_info in message.files:
                            try:
                                decoded_bytes = base64.b64decode(file_info.data)
                                processed_files.append({"mime_type": file_info.mime_type, "data": decoded_bytes, "filename": file_info.filename})
                            except (base64.binascii.Error, ValueError) as decode_error:
                                logger.error(f"File decoding error for {client_id} (file: {file_info.filename}): {decode_error}")
                                raise ValueError(f"Invalid Base64 data for file '{file_info.filename or 'unknown'}'.") # Re-raise to be caught below
                        response_stream = client.send_message(message.text, role=message.role, enable_tts=message.enableTTS, files_data=processed_files)
                    except (ValidationError, ValueError) as e: # Catch Pydantic and file processing errors
                        logger.error(f"Invalid multimodal_message or file error from {client_id}: {e}")
                        await websocket.send_json({"type": "error", "error": f"Invalid message format or file error: {e}"})
                        continue

                elif message_type == "update_settings":
                     logger.info(f"Settings update from {client_id}: {message_data.get('settings')}")
                     await websocket.send_json({"type": "settings_ack", "status": "received"})
                     continue # No response stream for settings

                else:
                     logger.warning(f"Unknown message type '{message_type}' from {client_id}")
                     await websocket.send_json({"type": "error", "error": f"Unknown message type: {message_type}"})
                     continue # Skip unknown types
                # --- End Message Processing ---

                # --- Stream Response ---
                if response_stream:
                    full_response_text = ""
                    async for response in response_stream:
                        if websocket.client_state != WebSocketState.CONNECTED: break
                        await websocket.send_json(response)
                        if response.get("type") == "text": full_response_text = response.get("content", full_response_text)

                    if websocket.client_state == WebSocketState.CONNECTED:
                        await websocket.send_json({"type": "complete", "text": full_response_text, "role": "assistant"})
                # --- End Stream Response ---

            # --- Inner Loop Exception Handling ---
            except WebSocketDisconnect:
                logger.info(f"{client_id} disconnected gracefully.")
                break
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON from {client_id}: {raw_data[:200]}...", exc_info=True)
                try: await websocket.send_json({"type": "error", "error": "Invalid JSON format received"})
                except Exception: pass
            except Exception as loop_e:
                logger.exception(f"Error processing message for {client_id}: {loop_e}")
                try: await websocket.send_json({"type": "error", "error": "Internal server error during processing"})
                except Exception: pass
                # Decide if loop should break on generic error, often yes
                # break
        # --- End Main Receive Loop ---

    except Exception as handler_e:
        logger.exception(f"Unhandled exception in WebSocket handler for {client_id}: {handler_e}")
    finally:
        # --- Cleanup ---
        logger.info(f"Cleaning up connection for client {client_id}")
        if client_id in connections:
            ws, client_instance = connections.pop(client_id)
            if client_instance:
                logger.info(f"Closing Gemini session for {client_id}")
                await client_instance.close()
            if ws.client_state != WebSocketState.DISCONNECTED:
                try:
                    await ws.close(code=1000)
                    logger.info(f"WebSocket closed for {client_id}")
                except Exception as close_e: logger.error(f"Error closing WebSocket for {client_id}: {close_e}")
        if client_id in last_activity: del last_activity[client_id]
        logger.info(f"Finished cleanup for {client_id}. Active connections: {len(connections)}")

# --- Run Server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, log_level=LOG_LEVEL.lower(), reload=False)

