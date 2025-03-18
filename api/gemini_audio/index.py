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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('gemini_audio')

@dataclass
class RequestMetrics:
    start_time: float
    text_length: int
    quality: str
    cache_hit: bool
    error: str = ''
    
    @property
    def duration_ms(self) -> float:
        return (time.time() - self.start_time) * 1000
    
    def log(self):
        metrics = {
            'duration_ms': self.duration_ms,
            'text_length': self.text_length,
            'quality': self.quality,
            'cache_hit': self.cache_hit
        }
        if self.error:
            metrics['error'] = self.error
            logger.error(f'Request failed: {json.dumps(metrics)}')
        else:
            logger.info(f'Request completed: {json.dumps(metrics)}')

def handler(request):
    """Handle HTTP requests for audio synthesis."""
    metrics = None
    try:
        # Start timing the request
        start_time = time.time()
        
        # Parse request body
        body = json.loads(request.body)
        
        # Initialize metrics
        metrics = RequestMetrics(
            start_time=start_time,
            text_length=len(body.get('text', '')),
            quality=body.get('quality', 'medium'),
            cache_hit=False
        )
        
        # Validate request
        if 'text' not in body:
            raise ValueError("Missing 'text' in request body")
        
        # Initialize Gemini client
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
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
        
        # Get and optimize audio
        audio_data = response.audio
        
        # Send response
        headers = {
            'Content-Type': 'audio/mpeg',
            'Content-Length': str(len(audio_data)),
            'X-Response-Time': f'{metrics.duration_ms:.2f}ms'
        }
        
        # Log metrics
        metrics.log()
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': audio_data
        }
        
    except Exception as e:
        # Update metrics with error
        if metrics:
            metrics.error = str(e)
            metrics.log()
        else:
            logger.error(f'Failed to process request: {str(e)}')
        
        # Handle errors
        error_response = json.dumps({
            "error": str(e)
        })
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': error_response
        }
