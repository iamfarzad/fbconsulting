from http import HTTPStatus
import json
import os
from typing import Dict, List, Any, Optional

from google.ai.generativelanguage import Candidate, Content, Part, Tool, GenerativeModel
from google.generativeai import configure, GenerativeModel
from google.auth.exceptions import DefaultCredentialsError

def generate_response(
    model_name: str,
    messages: List[Dict[str, Any]],
    tools: Optional[List[Tool]] = None,
    generation_config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Generate a response from a Gemini model."""
    try:
        api_key = os.environ.get("GOOGLE_API_KEY", "")
        if not api_key:
            return {"error": "Missing Google API key", "status": HTTPStatus.UNAUTHORIZED}

        configure(api_key=api_key)
        
        # Map CopilotKit message format to Gemini format
        gemini_messages = []
        for message in messages:
            role = "user" if message["role"] == "user" else "model"
            parts = [Part.from_text(message["content"])]
            gemini_messages.append(Content(role=role, parts=parts))
        
        # Set up the model and configuration
        model = GenerativeModel(model_name=model_name)
        response = model.generate_content(
            gemini_messages, 
            generation_config=generation_config or {
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40
            },
            stream=False
        )
        
        # Format the response for CopilotKit
        return {
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": response.text
                    }
                }
            ]
        }
        
    except DefaultCredentialsError as e:
        return {"error": f"Authentication error: {str(e)}", "status": HTTPStatus.UNAUTHORIZED}
    except Exception as e:
        return {"error": f"Error generating response: {str(e)}", "status": HTTPStatus.INTERNAL_SERVER_ERROR}

def handler(request):
    """Handle requests to the API route."""
    if request.method != "POST":
        return {"error": "Method not allowed", "status": HTTPStatus.METHOD_NOT_ALLOWED}
    
    try:
        body = request.get_json()
        
        # Extract parameters from the request
        model_name = body.get("model", "gemini-2.0-flash-exp")
        messages = body.get("messages", [])
        system_message = body.get("systemMessage", "")

        # Add system message if provided
        if system_message:
            messages.insert(0, {"role": "system", "content": system_message})
        
        # Generate response
        response = generate_response(
            model_name=model_name,
            messages=messages
        )
        
        return response
        
    except Exception as e:
        return {"error": f"Error processing request: {str(e)}", "status": HTTPStatus.INTERNAL_SERVER_ERROR}
