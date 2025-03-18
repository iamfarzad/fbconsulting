from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from gemini_client import GeminiClient
import json
import asyncio
from typing import Dict

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
connections: Dict[str, GeminiClient] = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    
    try:
        # Initialize Gemini client
        client = GeminiClient(os.getenv("GOOGLE_API_KEY"))
        connections[client_id] = client
        
        # Set up audio callback
        async def audio_callback(audio_data: bytes):
            await websocket.send_bytes(audio_data)
        
        client.set_audio_callback(audio_callback)
        
        # Initialize session with Charon voice
        await client.initialize_session("Charon")
        
        # Main WebSocket loop
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Process message
                response = await client.send_message(
                    message["text"],
                    message.get("role", "user")
                )
                
                # Send text response back to client
                await websocket.send_json(response)
                
            except WebSocketDisconnect:
                break
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up
        if client_id in connections:
            await connections[client_id].close()
            del connections[client_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
