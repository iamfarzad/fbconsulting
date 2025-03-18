from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
import json
import os
from typing import Dict, Any
from pydub import AudioSegment
import io
import tempfile
from datetime import datetime
import hashlib
import time
import logging
from dataclasses import dataclass

def handler(request):
    """Handle HTTP requests for audio synthesis."""
    try:
        # Parse request body
        body = json.loads(request.body)
        
        # Validate request
        if 'text' not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing text in request body'})
            }
        
        # Initialize Gemini client
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'GOOGLE_API_KEY environment variable is required'})
            }
        
        genai.configure(api_key=api_key)
        client = genai.Client()
        
        # Configure live session with Charon voice
        config = {
            "response_modalities": ["TEXT", "AUDIO"],
            "speech_config": {
                "voice_config": {
                    "prebuilt_voice_config": {
                        "voice_name": "Charon"
                    }
                }
            }
        }
        
        # Start live session and send text
        session = client.connect("gemini-2.0-flash", config)
        response = session.send({
            "turns": [{
                "parts": [{"text": body['text']}],
                "role": "user"
            }],
            "turn_complete": True
        })
        
        # Get audio data
        audio_data = response.audio
        
        # Send response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'audio/mpeg',
                'Content-Length': str(len(audio_data))
            },
            'body': audio_data
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
