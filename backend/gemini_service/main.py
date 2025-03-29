# backend/gemini_service/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, WebSocketState
from fastapi.middleware.cors import CORSMiddleware
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

# --- Load Environment Variables FIRST ---
# Specify the path to the .env file relative to this script
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
loaded = load_dotenv(dotenv_path=dotenv_path, verbose=True)
logger = logging.getLogger(__name__) # Setup logger early
logger.info(f"Attempted to load .env file from: {dotenv_path}, Loaded: {loaded}")

# --- Configuration ---
HOST = os.getenv('HOST', '0.0.0.0')
PORT = int(os.getenv('PORT', 8000))
DEFAULT_VOICE = os.getenv('DEFAULT_VOICE', 'Charon')
DEFAULT_LANGUAGE = os.getenv('DEFAULT_LANGUAGE', 'en-US')
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000,https://lovable.dev,https://*.googleprod.com').split(',') # Added wildcard for IDX previews
WS_PING_INTERVAL = int(os.getenv('WS_PING_INTERVAL', 30))
WS_PING_TIMEOUT = int(os.getenv('WS_PING_TIMEOUT', 10))
API_VERSION = "0.2.0" 

# --- Verify Critical Config --- 
GOOGLE_API_KEY_LOADED = bool(os.getenv("GOOGLE_API_KEY"))
logger.info(f"GOOGLE_API_KEY is loaded: {GOOGLE_API_KEY_LOADED}")
if not GOOGLE_API_KEY_LOADED:
    logger.error("CRITICAL: GOOGLE_API_KEY environment variable not found after load_dotenv!")
    # Consider exiting if the key is absolutely required at startup

# --- Pydantic Models --- 
class FileData(BaseModel): ... # (Keep models as before)
class TextMessage(BaseModel): ...
class MultimodalMessage(BaseModel): ...

# --- FastAPI App Setup --- 
app = FastAPI(...) # (Keep setup as before)
app.add_middleware(...) # (Keep CORS as before, check allowed origins)
logging.basicConfig(...) # (Keep logging as before)
logger.info(f"Starting Gemini WebSocket Service v{API_VERSION}")
logger.info(f"Allowed Origins: {ALLOWED_ORIGINS}") # Log effective origins

# --- State Management --- 
connections: Dict[str, Tuple[WebSocket, GeminiClient]] = {}
last_activity: Dict[str, float] = {}

# --- Lifespan Event Handler --- 
@asynccontextmanager
async def lifespan(app: FastAPI): ... # (Keep lifespan as before)
app.router.lifespan_context = lifespan

# --- API Endpoints --- 
@app.get("/version", tags=["Meta"])
async def get_version(): ... # (Keep as before)
@app.get("/health", tags=["Meta"])
async def health_check(): ... # (Keep as before, ensure it checks key)

# --- WebSocket Endpoint --- 
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    logger.info(f"Connection request from {client_id} @ {websocket.client.host}:{websocket.client.port}")
    await websocket.accept()
    logger.info(f"Connection accepted for {client_id}")
    client = None
    try:
        # --- Client Initialization ---
        api_key = os.getenv("GOOGLE_API_KEY")
        # **** ADD DEBUG PRINT ****
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
        # ... (rest of the websocket logic as before) ...
    # ... (exception handling as before) ...
    # ... (finally block as before) ...

# --- Run Server --- 
if __name__ == "__main__": ... # (Keep as before)
