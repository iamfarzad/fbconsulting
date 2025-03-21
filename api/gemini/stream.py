from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .client import GeminiClient
import json
import logging
from typing import Dict, Any, List

app = FastAPI()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store active connections
active_connections: Dict[str, WebSocket] = {}

@app.websocket("/api/gemini/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_id = str(id(websocket))
    active_connections[connection_id] = websocket
    client = GeminiClient()

    try:
        # Send initial connection success message
        await websocket.send_json({
            "type": "connection",
            "status": "connected"
        })

        while True:
            try:
                # Receive and parse message
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle different message types
                if message["type"] == "chat":
                    async for response in client.stream_chat(message["messages"]):
                        await websocket.send_text(response)
                
                elif message["type"] == "audio":
                    try:
                        audio_data = await client.generate_audio(
                            message["text"], 
                            message.get("voice_config")
                        )
                        await websocket.send_bytes(audio_data)
                    except NotImplementedError:
                        await websocket.send_json({
                            "type": "error",
                            "content": "Audio generation not yet supported"
                        })
                
                elif message["type"] == "vision":
                    try:
                        response = await client.process_vision_query(
                            message["image_data"],
                            message["query"]
                        )
                        await websocket.send_json({
                            "type": "vision_response",
                            "content": response
                        })
                    except Exception as e:
                        await websocket.send_json({
                            "type": "error",
                            "content": f"Vision query failed: {str(e)}"
                        })
                
                elif message["type"] == "health_check":
                    status = client.health_check()
                    await websocket.send_json({
                        "type": "health_response",
                        **status
                    })

            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "content": "Invalid JSON message"
                })
                continue

    except WebSocketDisconnect:
        logger.info(f"Client disconnected: {connection_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "content": f"Server error: {str(e)}"
            })
        except:
            pass
    finally:
        active_connections.pop(connection_id, None)

@app.get("/api/gemini/health")
async def health_check():
    """HTTP endpoint for health checks"""
    try:
        client = GeminiClient()
        status = client.health_check()
        return status
    except Exception as e:
        return {
            "status": False,
            "message": f"Health check failed: {str(e)}"
        }
