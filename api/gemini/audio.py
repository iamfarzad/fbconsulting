from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
import google.generativeai as genai
import os
import io
import asyncio
import logging
from typing import Optional

app = FastAPI()
logger = logging.getLogger("gemini-audio")
logger.setLevel(logging.INFO)

async def validate_gemini_live_api() -> Optional[str]:
    """Validate Gemini Live API is working"""
    try:
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            return "Missing API key"
        genai.configure(api_key=api_key)
        client = genai.AsyncClient()
        return None
    except Exception as e:
        return str(e)

@app.post("/api/gemini/audio")
async def generate_audio(request: Request):
    try:
        # Validate Live API availability
        validation_error = await validate_gemini_live_api()
        if validation_error:
            logger.error(f"Gemini Live API validation failed: {validation_error}")
            raise HTTPException(status_code=503, detail=f"Gemini Live API unavailable: {validation_error}")

        # Parse request
        body = await request.json()
        text = body.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")

        # Get API key
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Missing API key")

        # Configure Gemini
        genai.configure(api_key=api_key)
        client = genai.AsyncClient()

        model = "models/gemini-2.0-flash"
        voice = body.get("config", {}).get("voice", "Charon")

        config = {
            "response_modalities": ["AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice": voice
                }
            }
        }

        buffer = io.BytesIO()

        try:
            async with client.aio.live.connect(model=model, config=config) as session:
                await session.send(text, end_of_turn=True)

                async for chunk in session.receive():
                    if chunk.server_content and chunk.server_content.interrupted:
                        logger.warning("Audio generation interrupted.")
                        break
                    if chunk.data:
                        buffer.write(chunk.data)
        except Exception as e:
            logger.error(f"Audio streaming error: {e}")
            raise HTTPException(status_code=502, detail=f"Audio streaming failed: {str(e)}")

        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=speech.wav"}
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")