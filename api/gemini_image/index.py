from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import base64
from typing import List
import io

app = FastAPI()

async def process_image(file: UploadFile) -> dict:
    """Process a single image file."""
    content = await file.read()
    mime_type = file.content_type or 'image/jpeg'
    
    # Convert to base64
    b64_content = base64.b64encode(content).decode('utf-8')
    
    return {
        'mimeType': mime_type,
        'data': b64_content
    }

@app.post("/api/gemini_image")
async def upload_images(files: List[UploadFile] = File(...)) -> JSONResponse:
    """
    Handle image uploads for Gemini chat.
    Returns base64 encoded images with mime types.
    """
    try:
        processed_images = []
        
        for file in files:
            image_data = await process_image(file)
            processed_images.append(image_data)
            
        return JSONResponse({
            'success': True,
            'images': processed_images
        })
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                'success': False,
                'error': str(e)
            }
        )
