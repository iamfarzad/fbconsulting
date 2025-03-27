<<<<<<< HEAD
from vertexai.generative_models import GenerativeModel
import vertexai

# Initialize Vertex AI with your project ID
vertexai.init(
    project="782216609975",
    location="us-central1"  # Required for Gemini
)

# Load Gemini model
model = GenerativeModel("gemini-1.5-pro-001")  # Update to "gemini-2.5-pro" when available

# Prompt
response = model.generate_content("Explain how AI works")

# Print result
print(response.text)

=======
import google.generativeai as genai
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
            config = {
                "response_modalities": ["TEXT", "AUDIO"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice_config": {
                            "voice_name": self.voice_name
                        }
                    }
                }
            }
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
>>>>>>> origin/remove-firebase-key
