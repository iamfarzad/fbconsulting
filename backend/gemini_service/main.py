import asyncio
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from gemini_client import GeminiClient

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://your-vercel-domain.vercel.app",
    "https://your-development-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    gemini_client = GeminiClient(api_key="your_api_key_here")
    clients[client_id] = gemini_client

    try:
        await gemini_client.connect()
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message.get("type") == "text":
                response = await gemini_client.send_message(message["content"])
                await websocket.send_text(json.dumps({"type": "text", "content": response["text"]}))
            elif message.get("type") == "audio":
                # Handle audio message
                pass
    except WebSocketDisconnect:
        logging.info(f"Client {client_id} disconnected")
    except Exception as e:
        logging.error(f"Error: {e}")
    finally:
        await gemini_client.close()
        del clients[client_id]
        await websocket.close()
