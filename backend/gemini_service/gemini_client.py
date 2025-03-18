import google.generativeai as genai
from typing import Optional, Dict, Any
import asyncio
import json

class GeminiClient:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.session = None
        self.audio_callback = None

    async def initialize_session(self, voice_name: str = "Charon"):
        """Initialize a new Gemini session with audio capabilities"""
        config = {
            "response_modalities": ["TEXT", "AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": voice_name
                    }
                }
            }
        }
        
        self.session = await self.client.connect("gemini-2.0-flash", config)
        
        # Set up audio event handler
        self.session.on("audio", self._handle_audio)
        
        return True

    def _handle_audio(self, audio_data: bytes):
        """Handle incoming audio data from Gemini"""
        if self.audio_callback:
            asyncio.create_task(self.audio_callback(audio_data))

    async def send_message(self, message: str, role: str = "user") -> Dict[str, Any]:
        """Send a message to Gemini and get the response"""
        if not self.session:
            raise RuntimeError("Session not initialized")

        await self.session.send({
            "turns": [{
                "parts": [{"text": message}],
                "role": role
            }],
            "turn_complete": True
        })

        # The response will be handled through the event handlers
        return {"status": "sent"}

    def set_audio_callback(self, callback):
        """Set the callback for audio data"""
        self.audio_callback = callback

    async def close(self):
        """Close the Gemini session"""
        if self.session:
            await self.session.close()
            self.session = None
