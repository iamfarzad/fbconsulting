import os
import io
import asyncio
import json
from typing import AsyncGenerator, Dict, Any
import google.generativeai as genai

class GeminiClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key not found")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.vision_model = genai.GenerativeModel('gemini-2.0-flash-vision')

    async def stream_chat(self, messages: list, config: Dict[str, Any] = None) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from Gemini
        """
        try:
            default_config = {
                'temperature': 0.7,
                'max_output_tokens': 2048,
                'top_k': 40,
                'top_p': 0.95,
            }
            chat_config = {**default_config, **(config or {})}
            chat = self.model.start_chat(history=[])

            response = await chat.send_message_async(
                messages[-1]['content'],
                **chat_config,
                stream=True
            )

            async for chunk in response:
                if chunk.text:
                    yield json.dumps({
                        'type': 'text',
                        'content': chunk.text
                    })
        except Exception as e:
            yield json.dumps({
                'type': 'error',
                'content': str(e)
            })

    async def generate_audio(self, text: str, voice_config: Dict[str, Any] = None) -> bytes:
        """
        Generate audio from text using Gemini Live API (streamed audio)
        """
        try:
            client = genai.AsyncClient()
            model = "models/gemini-2.0-flash"
            voice = (voice_config or {}).get("voice", "Charon")

            config = {
                "response_modalities": ["AUDIO"],
                "speech_config": {
                    "voice_config": {
                        "prebuilt_voice": voice
                    }
                }
            }

            buffer = io.BytesIO()

            async with client.aio.live.connect(model=model, config=config) as session:
                await session.send(text, end_of_turn=True)
                async for chunk in session.receive():
                    if chunk.data:
                        buffer.write(chunk.data)

            return buffer.getvalue()

        except Exception as e:
            raise Exception(f"Audio generation failed: {str(e)}")

    async def process_vision_query(self, image_data: bytes, query: str) -> str:
        """
        Process queries about images using Gemini Vision
        """
        try:
            response = await self.vision_model.generate_content_async([image_data, query])
            return response.text
        except Exception as e:
            raise Exception(f"Vision query processing failed: {str(e)}")

    def health_check(self) -> Dict[str, bool]:
        """
        Check if the Gemini service is accessible and API key is valid
        """
        try:
            genai.get_model('gemini-2.0-flash')
            return {'status': True, 'message': 'Gemini service is healthy'}
        except Exception as e:
            return {'status': False, 'message': str(e)}