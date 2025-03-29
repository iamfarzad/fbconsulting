# backend/gemini_service/main.py
import base64
import json
import asyncio
import logging
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, WebSocketState
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError

from gemini_client import GeminiClient

# --- Load Environment Variables FIRST ---
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
loaded = load_dotenv(dotenv_path=dotenv_path, verbose=True)
logger = logging.getLogger(__name__) # Setup logger early
# Configure logging level early based on env or default
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
logging.basicConfig(level=getattr(logging, LOG_LEVEL.upper(), logging.INFO),
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger.info(f"Attempted to load .env file from: {dotenv_path}, Loaded: {loaded}")

# --- Configuration ---
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEFAULT_VOICE = os.getenv('DEFAULT_VOICE', 'Charon')
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'en-US')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000,https://lovable.dev,https://*.googleprod.com').split(',')
WS_PING_INTERVAL = int(os.getenv('WS_PING_INTERVAL', 30))
WS_PING_TIMEOUT = int(os.getenv('WS_PING_TIMEOUT', 10))
API_VERSION = "0.2.0" # Reflects multimodal support

# --- Verify Critical Config --- 
GOOGLE_API_KEY_LOADED = bool(os.getenv("GOOGLE_API_KEY"))
logger.info(f"GOOGLE_API_KEY is loaded: {GOOGLE_API_KEY_LOADED}")
if not GOOGLE_API_KEY_LOADED:
    logger.error("CRITICAL: GOOGLE_API_KEY environment variable not found!")

# --- Pydantic Models --- 
class FileData(BaseModel):
    mime_type: str
    data: str = Field(..., description="Base64 encoded file data")
    filename: Optional[str] = None

class TextMessage(BaseModel):
    type: str # = Field("text_message", Literal=True) # Literal requires Python 3.8+
    text: str
    role: str = "user"
    enableTTS: bool = True

class MultimodalMessage(BaseModel):
    type: str # = Field("multimodal_message", Literal=True)
    text: Optional[str] = None
    files: List[FileData] = Field(..., min_items=1)
    role: str = "user"
    enableTTS: bool = True

# --- State Management --- 
connections: Dict[str, Tuple[WebSocket, GeminiClient]] = {}
last_activity: Dict[str, float] = {}

# --- Lifespan Management --- 
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
            try: await ws.close(code=1001)
            except Exception: pass
    connections.clear(); last_activity.clear()
    logger.info("Lifespan shutdown complete.")

# --- FastAPI App Setup --- 
app = FastAPI(
    title="Gemini Multimodal WebSocket Service",
    version=API_VERSION,
    description="Provides a WebSocket interface to interact with Google Gemini.",
    openapi_tags=[{"name": "WebSocket", "description": "Main endpoint"}, {"name": "Meta", "description": "Metadata"}],
    lifespan=lifespan # Use the lifespan context manager
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"Starting Gemini WebSocket Service v{API_VERSION}")
logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}")

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
    logger.info(f"Connection request from {client_id} @ {websocket.client.host}:{websocket.client.port}")
    await websocket.accept()
    logger.info(f"Connection accepted for {client_id}")
    client = None
    ping_task = None
    try:
        # --- Client Initialization ---
        api_key = os.getenv("GOOGLE_API_KEY")
        logger.info(f"[ws/{client_id}] Checking API Key. Found: {bool(api_key)}") 
        if not api_key:
            logger.error(f"[ws/{client_id}] Closing: Missing GOOGLE_API_KEY configuration")
            await websocket.close(code=1008, reason="Missing GOOGLE_API_KEY configuration")
            return
        try:
            logger.info(f"[ws/{client_id}] Initializing GeminiClient...")
            client = GeminiClient(api_key)
            logger.info(f"[ws/{client_id}] Initializing Gemini Session...")
            await client.initialize_session(DEFAULT_VOICE, DEFAULT_LANGUAGE)
            logger.info(f"[ws/{client_id}] Gemini session initialized successfully.")
        except Exception as init_error:
            logger.exception(f"[ws/{client_id}] Gemini initialization failed: {init_error}")
            await websocket.close(code=1011, reason=f"Failed to initialize Gemini session: {init_error}")
            return

        connections[client_id] = (websocket, client)
        last_activity[client_id] = asyncio.get_event_loop().time()
        logger.info(f"Client {client_id} connected. Active connections: {len(connections)}")

        # --- Audio Callback Setup ---
        async def audio_callback(audio_data: bytes):
            if client_id in connections and connections[client_id][0].client_state == WebSocketState.CONNECTED:
                try:
                    ws, _ = connections[client_id]
                    await ws.send_json({"type": "audio_chunk_info", "size": len(audio_data), "format": "mp3"})
                    await ws.send_bytes(audio_data)
                except Exception as audio_e: logger.error(f"Audio send error for {client_id}: {audio_e}")
            else: logger.warning(f"Audio callback for disconnected client {client_id}")
        client.set_audio_callback(audio_callback)

        # --- Main Receive Loop ---
        while True:
            response_stream = None
            raw_data = None # Initialize raw_data
            try:
                raw_data = await asyncio.wait_for(websocket.receive_text(), timeout=WS_PING_INTERVAL * 1.5)
                message_data = json.loads(raw_data)
                message_type = message_data.get("type")
                last_activity[client_id] = asyncio.get_event_loop().time()

                if message_type == 'ping': await websocket.send_json({"type": "pong"}); continue
                logger.info(f"Received type '{message_type}' from {client_id}")

                if message_type == "text_message":
                    message = TextMessage.model_validate(message_data)
                    response_stream = client.send_message(message.text, role=message.role, enable_tts=message.enableTTS, files_data=None)
                elif message_type == "multimodal_message":
                    message = MultimodalMessage.model_validate(message_data)
                    processed_files = []
                    for file_info in message.files:
                        decoded_bytes = base64.b64decode(file_info.data)
                        processed_files.append({"mime_type": file_info.mime_type, "data": decoded_bytes, "filename": file_info.filename})
                    response_stream = client.send_message(message.text, role=message.role, enable_tts=message.enableTTS, files_data=processed_files)
                elif message_type == "update_settings": logger.info(f"Settings update from {client_id}"); await websocket.send_json({"type": "settings_ack"}); continue
                else: logger.warning(f"Unknown type '{message_type}' from {client_id}"); await websocket.send_json({"type": "error", "error": f"Unknown type: {message_type}"}); continue

                if response_stream:
                    full_response_text = ""
                    async for response in response_stream:
                        if websocket.client_state != WebSocketState.CONNECTED: break
                        await websocket.send_json(response)
                        if response.get("type") == "text": full_response_text = response.get("content", full_response_text)
                    if websocket.client_state == WebSocketState.CONNECTED: await websocket.send_json({"type": "complete", "text": full_response_text, "role": "assistant"})

            except asyncio.TimeoutError:
                logger.warning(f"Receive timeout for {client_id}. Closing.")
                break
            except WebSocketDisconnect:
                logger.info(f"{client_id} disconnected gracefully.")
                break
            except (json.JSONDecodeError, ValidationError, ValueError, base64.binascii.Error) as data_err:
                logger.error(f"Data/Validation error for {client_id}: {data_err} - Data: {raw_data[:200] if raw_data else 'N/A'}...", exc_info=True)
                try: await websocket.send_json({"type": "error", "error": f"Invalid message format or data: {data_err}"})
                except Exception: pass
            except Exception as loop_e:
                logger.exception(f"Error processing message for {client_id}: {loop_e}")
                try: await websocket.send_json({"type": "error", "error": "Internal server error"})
                except Exception: pass
                break # Break loop on unexpected processing errors

    except Exception as handler_e: # Catch errors during initial setup phase
        logger.exception(f"Unhandled exception in WebSocket handler setup for {client_id}: {handler_e}")
    finally:
        # --- Cleanup ---
        logger.info(f"Cleaning up connection for client {client_id}")
        if client_id in connections:
            ws, client_instance = connections.pop(client_id)
            if client_instance: await client_instance.close()
            if ws.client_state != WebSocketState.DISCONNECTED: 
                try: await ws.close(code=1000)
                except Exception: pass
        if client_id in last_activity: del last_activity[client_id]
        logger.info(f"Finished cleanup for {client_id}. Active connections: {len(connections)}")

# --- Run Server --- 
if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting Uvicorn server on {HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, log_level=LOG_LEVEL.lower(), reload=False)

