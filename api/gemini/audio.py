from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from .client import GeminiClient
import io
import json
from typing import Dict, Any

app = FastAPI()

@app.post("/api/gemini/audio")
async def generate_audio(request: Dict[str, Any]):
    """
    Generate audio from text using Gemini's text-to-speech capability
    """
    try:
        client = GeminiClient()
        
        if 'text' not in request:
            raise HTTPException(status_code=400, detail="Text is required")
        
        text = request['text']
        voice_config = request.get('config', {})
        
        try:
            audio_data = await client.generate_audio(text, voice_config)
            
            # Create an in-memory buffer
            buffer = io.BytesIO(audio_data)
            buffer.seek(0)
            
            # Return the audio file as a streaming response
            return StreamingResponse(
                buffer,
                media_type="audio/wav",
                headers={
                    "Content-Disposition": "attachment;filename=speech.wav"
                }
            )
            
        except NotImplementedError:
            # If native TTS is not available, return an error
            return {
                "status": "error",
                "message": "Text-to-speech generation is not yet available"
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Audio generation failed: {str(e)}"
        )
