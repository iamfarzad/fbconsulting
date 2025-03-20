from http.server import BaseHTTPRequestHandler
import google.generativeai as genai
import json
import os
from typing import Dict, Any
import io
import tempfile
from datetime import datetime
import hashlib
import time
import logging

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
        
        # Start live session and send text with timeout
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
                }, timeout=15)  # 15 second timeout per attempt
                
                # Get audio data and break if successful
                audio_data = response.audio
                break
                
            except Exception as e:
                logging.warning(f"Attempt {retry_count + 1} failed: {str(e)}")
                retry_count += 1
                
                # Close the session if it exists
                if session:
                    try:
                        session.close()
                    except Exception as se:
                        logging.warning(f"Error closing session: {se}")
                    session = None
                
                # Wait before retrying
                if retry_count <= max_retries:
                    time.sleep(1)
        
        if not audio_data:
            raise Exception("Failed to generate audio after multiple attempts")
            
        # Always clean up the session in a separate try block
        if session:
            try:
                session.close()
            except Exception as e:
                logging.warning(f"Error closing Gemini session: {e}")
        
        # Send response
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'audio/mpeg',
                'Content-Length': str(len(audio_data))
            },
            'body': audio_data,
            'isBase64Encoded': True
        }
        
    except Exception as e:
        logging.error(f"Error in gemini_audio handler: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
