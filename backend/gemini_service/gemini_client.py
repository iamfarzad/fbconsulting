import google.generativeai as genai
<<<<<<< HEAD
from typing import Optional, Dict, Any, Callable, AsyncIterable
import asyncio
import json
import logging

logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.client = genai.Client()
        self.session = None
        self.audio_callback = None
        self.voice_config = {
            "name": "Charon",
            "language": "en-US",
            "rate": 1.0,
            "pitch": 0.0
        }

    async def initialize_session(self, 
                               voice_name: str = "Charon", 
                               language: str = "en-US",
                               rate: float = 1.0,
                               pitch: float = 0.0):
        """Initialize a new live session with Gemini"""
        try:
            self.voice_config = {
                "name": voice_name,
                "language": language,
                "rate": max(0.25, min(4.0, rate)),  # Clamp between 0.25 and 4.0
                "pitch": max(-20.0, min(20.0, pitch))  # Clamp between -20 and +20
            }
            
            logger.info(f"Initializing live session with voice config: {self.voice_config}")
            
            # Configure for LiveAPI session with both text and audio
=======
import asyncio
import websockets
import json
import logging

class GeminiClient:
    def __init__(self, api_key, model_name='gemini-2.0-flash', voice_name='Charon'):
        self.api_key = api_key
        self.model_name = model_name
        self.voice_name = voice_name
        self.session = None
        self.connected = False

    async def connect(self):
        try:
            genai.configure(api_key=self.api_key)
            client = genai.Client()
>>>>>>> 29d5d49c4822468a5d058b37c001746357598fd3
            config = {
                "response_modalities": ["TEXT", "AUDIO"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {
<<<<<<< HEAD
                            "voice_name": self.voice_config["name"]
=======
                            "voice_name": self.voice_name
>>>>>>> 29d5d49c4822468a5d058b37c001746357598fd3
                        }
                    }
                }
            }
<<<<<<< HEAD
            
            # Start a new live session with gemini-2.0-flash
            self.session = self.client.connect("gemini-2.0-flash", config)
            return True
        except Exception as e:
            logger.error(f"Session initialization failed: {str(e)}")
            raise RuntimeError(f"Session initialization failed: {str(e)}")

    async def send_message(self, text: str, role: str = "user", enable_tts: bool = True) -> AsyncIterable[Dict[str, Any]]:
        """Send message using Gemini Live API and stream responses with audio"""
        if not self.session:
            logger.error("Session not initialized")
            raise RuntimeError("Session not initialized")

        try:
            # Send message using the Live API
            logger.info(f"Sending message: {text[:50]}...")
            
            # Create request with proper structure for both text and audio
            request = {
                "contents": [{
                    "parts": [{"text": text}],
                    "role": role
                }],
                "tools": [{
                    "function_declarations": [{
                        "name": "text_to_speech",
                        "description": "Convert text to speech",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "text": {"type": "string"}
                            },
                            "required": ["text"]
                        }
                    }]
                }]
            }
            
            # Send to LiveAPI - this will return both text and audio
            async for response in self.session.send_message_streaming(request):
                if response.text:
                    # Yield text response
                    yield {
                        "type": "text",
                        "content": response.text,
                        "role": "assistant"
                    }
                
                if enable_tts and self.audio_callback and response.audio:
                    try:
                        # The audio comes directly from the Live API
                        await self.audio_callback(response.audio)
                        
                        yield {
                            "type": "audio_chunk",
                            "size": len(response.audio)
                        }
                    except Exception as e:
                        logger.error(f"Audio processing failed: {str(e)}")
                        yield {
                            "type": "error",
                            "error": f"Audio processing failed: {str(e)}"
                        }

            # Send final complete response
            yield {
                "type": "complete",
                "role": "assistant"
            }

        except Exception as e:
            logger.error(f"Message processing failed: {str(e)}")
            yield {
                "type": "error",
                "error": str(e)
            }

    def set_audio_callback(self, callback: Callable):
        """Set the callback for audio data"""
        self.audio_callback = callback

    async def update_voice_settings(self, 
                                  voice_name: Optional[str] = None,
                                  language: Optional[str] = None,
                                  rate: Optional[float] = None,
                                  pitch: Optional[float] = None):
        """Update voice configuration settings"""
        if voice_name:
            self.voice_config["name"] = voice_name
        if language:
            self.voice_config["language"] = language
        if rate is not None:
            self.voice_config["rate"] = max(0.25, min(4.0, rate))
        if pitch is not None:
            self.voice_config["pitch"] = max(-20.0, min(20.0, pitch))

        logger.info(f"Updated voice settings: {self.voice_config}")

    async def close(self):
        """Clean up resources"""
        if self.session:
            try:
                self.session.close()
                self.session = None
                logger.info("Live session closed")
            except Exception as e:
                logger.error(f"Error closing session: {e}")
=======
            self.session = client.connect(self.model_name, config)
            self.connected = True
        except Exception as e:
            logging.error(f"Failed to connect to Gemini Live API: {e}")
            self.connected = False

    async def send_message(self, message):
        if not self.connected:
            await self.connect()
        try:
            response = self.session.send({
                "turns": [{
                    "parts": [{"text": message}],
                    "role": "user"
                }],
                "turn_complete": True
            })
            return response
        except Exception as e:
            logging.error(f"Failed to send message: {e}")
            return None

    async def receive_responses(self):
        if not self.connected:
            await self.connect()
        try:
            while True:
                response = await self.session.receive()
                yield response
        except Exception as e:
            logging.error(f"Failed to receive responses: {e}")

    async def close(self):
        if self.session:
            await self.session.close()
            self.connected = False
>>>>>>> 29d5d49c4822468a5d058b37c001746357598fd3
