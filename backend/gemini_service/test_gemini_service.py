import pytest
import asyncio
import websockets
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration for tests
TEST_HOST = "localhost"
TEST_PORT = 8000
TEST_MESSAGES = [
    "Hello, how are you?",
    "Tell me a joke about programming.",
    "What's the weather like today?"
]
AUDIO_OUTPUT_DIR = Path("test_audio_output")

@pytest.fixture(autouse=True)
def setup_teardown():
    """Setup and teardown for tests"""
    # Setup
    AUDIO_OUTPUT_DIR.mkdir(exist_ok=True)
    yield
    # Teardown
    for file in AUDIO_OUTPUT_DIR.glob("*.mp3"):
        file.unlink()
    AUDIO_OUTPUT_DIR.rmdir()

@pytest.fixture
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

async def connect_websocket(client_id: str = "test-client"):
    """Helper function to connect to WebSocket"""
    uri = f"ws://{TEST_HOST}:{TEST_PORT}/ws/{client_id}"
    return await websockets.connect(uri)

async def send_message(websocket, message: str, enable_tts: bool = True):
    """Helper function to send message and collect responses"""
    message_data = {
        "text": message,
        "role": "user",
        "enableTTS": enable_tts
    }
    await websocket.send(json.dumps(message_data))
    
    responses = {
        "text": None,
        "audio_chunks": [],
        "errors": []
    }
    
    while True:
        try:
            response = await websocket.recv()
            if isinstance(response, str):
                data = json.loads(response)
                if data.get("type") == "text":
                    responses["text"] = data.get("content")
                elif data.get("type") == "error":
                    responses["errors"].append(data.get("error"))
                elif data.get("type") == "complete":
                    break
            else:
                responses["audio_chunks"].append(response)
        except websockets.exceptions.ConnectionClosed:
            break
    
    return responses

@pytest.mark.asyncio
async def test_websocket_connection():
    """Test basic WebSocket connection"""
    async with await connect_websocket() as websocket:
        assert websocket.open

@pytest.mark.asyncio
async def test_text_response():
    """Test text response from Gemini"""
    async with await connect_websocket() as websocket:
        responses = await send_message(websocket, "Hello")
        assert responses["text"] is not None
        assert len(responses["errors"]) == 0

@pytest.mark.asyncio
async def test_audio_generation():
    """Test audio generation"""
    async with await connect_websocket() as websocket:
        responses = await send_message(websocket, "Generate some audio")
        assert len(responses["audio_chunks"]) > 0
        assert len(responses["errors"]) == 0

@pytest.mark.asyncio
async def test_error_handling():
    """Test error handling with invalid message"""
    async with await connect_websocket() as websocket:
        await websocket.send("invalid json")
        response = await websocket.recv()
        data = json.loads(response)
        assert "error" in data

@pytest.mark.asyncio
@pytest.mark.parametrize("message", TEST_MESSAGES)
async def test_multiple_messages(message):
    """Test multiple different messages"""
    async with await connect_websocket() as websocket:
        responses = await send_message(websocket, message)
        assert responses["text"] is not None
        assert len(responses["audio_chunks"]) > 0
        
        # Save audio for manual verification
        if responses["audio_chunks"]:
            audio_data = b"".join(responses["audio_chunks"])
            output_file = AUDIO_OUTPUT_DIR / f"response_{message[:20]}.mp3"
            output_file.write_bytes(audio_data)

@pytest.mark.asyncio
async def test_concurrent_connections():
    """Test multiple concurrent connections"""
    async def client_session(client_id: str):
        async with await connect_websocket(client_id) as websocket:
            return await send_message(websocket, f"Hello from {client_id}")
    
    clients = [f"test-client-{i}" for i in range(3)]
    results = await asyncio.gather(*[
        client_session(client_id) for client_id in clients
    ])
    
    assert all(result["text"] is not None for result in results)
    assert all(len(result["errors"]) == 0 for result in results)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
