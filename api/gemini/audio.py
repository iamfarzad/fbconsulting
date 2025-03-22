
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
import google.generativeai as genai
import os
import io
import json
from typing import Dict, Any
import logging

app = FastAPI()
logger = logging.getLogger("gemini-audio")
logger.setLevel(logging.INFO)

@app.post("/api/gemini/audio")
async def generate_audio(request: Request):
    """
    Generate audio from text using Gemini's text-to-speech capability
    """
    try:
        # Read and parse request
        body = await request.json()
        
        if 'text' not in body:
            raise HTTPException(status_code=400, detail="Text is required")
        
        text = body['text']
        voice_config = body.get('config', {})
        
        # Get API key from environment
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not found")
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        client = genai.Client()
        
        # Configure speech settings with Charon voice
        speech_config = {
            "response_modalities": ["TEXT", "AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": voice_config.get('voice', "Charon")
                    }
                }
            }
        }
        
        # Start live session and send text
        logger.info(f"Generating audio for text length: {len(text)}")
        session = client.connect("gemini-2.0-flash", speech_config)
        
        response = session.send({
            "turns": [{
                "parts": [{"text": text}],
                "role": "user"
            }],
            "turn_complete": True
        })
        
        # Get audio data
        audio_data = response.audio
        
        # Create an in-memory buffer
        buffer = io.BytesIO(audio_data)
        buffer.seek(0)
        
        # Return the audio file as a streaming response
        return StreamingResponse(
            buffer,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment;filename=speech.mp3"
            }
        )
        
    except Exception as e:
        logger.error(f"Audio generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Audio generation failed: {str(e)}"
        )
