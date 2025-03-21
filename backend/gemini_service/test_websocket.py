import asyncio
import websockets
import json
import os
from dotenv import load_dotenv
import logging
import argparse

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def save_audio(audio_data: bytes, filename: str):
    """Save audio data to a file"""
    with open(filename, 'wb') as f:
        f.write(audio_data)
    logger.info(f"Saved audio to {filename}")

async def connect_and_test():
    """Connect to WebSocket and test functionality"""
    load_dotenv()

    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Test Gemini WebSocket Service')
    parser.add_argument('--host', default='localhost', help='WebSocket host')
    parser.add_argument('--port', type=int, default=8000, help='WebSocket port')
    parser.add_argument('--message', default='Tell me a short joke', help='Message to send')
    parser.add_argument('--save-audio', action='store_true', help='Save received audio chunks')
    args = parser.parse_args()

    # Connect to WebSocket
    uri = f"ws://{args.host}:{args.port}/ws/test-client"
    audio_chunks = []
    chunk_count = 0

    try:
        async with websockets.connect(uri) as websocket:
            logger.info(f"Connected to {uri}")

            # Send a test message
            message = {
                "text": args.message,
                "role": "user",
                "enableTTS": True
            }
            await websocket.send(json.dumps(message))
            logger.info(f"Sent message: {args.message}")

            # Process responses
            while True:
                try:
                    response = await websocket.recv()
                    
                    if isinstance(response, str):
                        # Handle JSON messages
                        data = json.loads(response)
                        if data.get('type') == 'text':
                            logger.info(f"Received text: {data.get('content')}")
                        elif data.get('type') == 'error':
                            logger.error(f"Received error: {data.get('error')}")
                        elif data.get('type') == 'audio_meta':
                            logger.info(f"Audio metadata: total_size={data.get('total_size')}, chunk_size={data.get('chunk_size')}")
                        elif data.get('type') == 'complete':
                            logger.info("Message complete")
                            if args.save_audio and audio_chunks:
                                # Combine and save audio chunks
                                audio_data = b''.join(audio_chunks)
                                await save_audio(audio_data, f'response_{chunk_count}.mp3')
                                audio_chunks = []
                                chunk_count += 1
                    else:
                        # Handle binary (audio) data
                        logger.info(f"Received audio chunk: {len(response)} bytes")
                        if args.save_audio:
                            audio_chunks.append(response)

                except websockets.exceptions.ConnectionClosed:
                    logger.info("Connection closed")
                    break
                except Exception as e:
                    logger.error(f"Error processing response: {e}")
                    break

    except Exception as e:
        logger.error(f"Connection error: {e}")

if __name__ == "__main__":
    asyncio.run(connect_and_test())
