from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import Response, JSONResponse
import time
from .gemini import Client

app = FastAPI()

@app.post("/api/gemini/audio")
async def handle_audio(request: Request):
    try:
        body = await request.json()
        
        if not body or 'text' not in body:
            raise HTTPException(
                status_code=400,
                detail="Missing required text in request body"
            )

        client = Client()
        config = {
            "model": {
                "provider": "anthropic",
                "name": "claude-3-opus-20240229",
                "temperature": 0.7,
                "max_tokens": 1000
            }
        }

        # Start live session and send text with timeout and retry logic
        session = None
        start_time = time.time()
        max_retries = 2
        retry_count = 0
        audio_data = None

        while retry_count <= max_retries and time.time() - start_time < 45:  # Overall timeout of 45 seconds
            try:
                session = client.connect("gemini-2.0-flash", config)
                response = session.send({
                    "turns": [{
                        "parts": [{"text": body['text']}],
                        "role": "user"
                    }],
                    "turn_complete": True
                })

                if response and response.get('audio'):
                    audio_data = response['audio']
                    break
                
                retry_count += 1
                time.sleep(1)  # Brief pause between retries
                
            except Exception as e:
                retry_count += 1
                if retry_count > max_retries:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to generate audio after {max_retries} attempts: {str(e)}"
                    )
                continue

        if not audio_data:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate audio response"
            )

        # Return audio data as response
        return Response(
            content=audio_data,
            media_type='audio/mp3',
            headers={
                'Content-Disposition': 'attachment; filename=response.mp3'
            }
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# Vercel requires a handler function
def handler(request: Request):
    return app(request._scope, request._receive)
