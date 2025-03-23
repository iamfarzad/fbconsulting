from base64 import b64decode
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

genai.configure(api_key=api_key)

router = APIRouter()

class ImageInput(BaseModel):
    mimeType: str
    data: str

class AskRequest(BaseModel):
    prompt: str
    persona: Optional[str] = None
    images: Optional[List[ImageInput]] = None

def handler(data: dict) -> dict:
    try:
        request = AskRequest(**data)
        if request.images:
            model = genai.GenerativeModel("gemini-pro-vision")
            processed_images = [
                {
                    "mime_type": img.mimeType,
                    "data": b64decode(img.data.split(",")[1])
                }
                for img in request.images
            ]
            result = model.generate_content([request.prompt, *processed_images])
        else:
            model = genai.GenerativeModel("gemini-pro")
            result = model.generate_content(request.prompt)

        return {"text": result.text if hasattr(result, "text") else None}
    except Exception as e:
        return {"error": str(e)}