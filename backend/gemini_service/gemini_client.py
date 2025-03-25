import google.generativeai as genai
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
            config = {
                "response_modalities": ["TEXT", "AUDIO"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {
                            "voice_name": self.voice_config["name"]
                        }
                    }
                }
            }
            
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

    async def stream_chat(self, messages: list) -> AsyncIterable[str]:
        """Stream chat responses from Gemini"""
        try:
            for message in messages:
                async for response in self.send_message(message["content"], message["role"]):
                    if response["type"] == "text":
                        yield response["content"]
        except Exception as e:
            logger.error(f"Error streaming chat: {str(e)}")
            yield f"Error: {str(e)}"

    async def generate_audio(self, text: str, voice_config: Optional[Dict[str, Any]] = None) -> bytes:
        """Generate audio from text using Gemini"""
        try:
            if voice_config:
                await self.update_voice_settings(**voice_config)
            async for response in self.send_message(text, enable_tts=True):
                if response["type"] == "audio_chunk":
                    return response["content"]
        except Exception as e:
            logger.error(f"Error generating audio: {str(e)}")
            raise RuntimeError(f"Error generating audio: {str(e)}")

    def health_check(self) -> Dict[str, Any]:
        """Perform a health check on the Gemini client"""
        try:
            if self.session:
                return {"status": "healthy"}
            else:
                return {"status": "unhealthy", "message": "Session not initialized"}
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {"status": "unhealthy", "message": str(e)}
