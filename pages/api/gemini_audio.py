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

# Simple in-memory cache for responses
response_cache: Dict[str, tuple[bytes, datetime]] = {}
CACHE_DURATION = 3600  # 1 hour in seconds

def get_cache_key(text: str, quality: str) -> str:
    """Generate cache key from text and quality setting."""
    return hashlib.md5(f"{text}:{quality}".encode()).hexdigest()

def optimize_audio(audio_data: bytes, quality: str = 'medium') -> bytes:
    """Optimize audio based on quality setting."""
    try:
        # Write WAV data to temporary file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav.write(audio_data)
            temp_wav.flush()
            
            # Load with pydub
            audio = AudioSegment.from_wav(temp_wav.name)
            
            # Quality settings
            quality_settings = {
                'low': {'bitrate': '64k', 'sample_rate': 22050},
                'medium': {'bitrate': '128k', 'sample_rate': 44100},
                'high': {'bitrate': '192k', 'sample_rate': 48000}
            }
            
            settings = quality_settings.get(quality, quality_settings['medium'])
            
            # Export as MP3
            output = io.BytesIO()
            audio.export(output, 
                        format='mp3',
                        bitrate=settings['bitrate'],
                        parameters=['-ar', str(settings['sample_rate'])])
            return output.getvalue()
            
    except Exception as e:
        print(f"Audio optimization failed: {e}")
        return audio_data  # Return original if optimization fails

class handler:
    def do_POST(self):
        """Handle POST requests for audio synthesis."""
        metrics = None
        try:
            # Start timing the request
            start_time = time.time()
            
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            # Initialize metrics
            metrics = RequestMetrics(
                start_time=start_time,
                text_length=len(data.get('text', '')),
                quality=data.get('quality', 'medium'),
                cache_hit=False
            )
            
            # Validate request
            if 'text' not in data:
                raise ValueError("Missing 'text' in request body")
            
            # Get quality setting
            quality = data.get('quality', 'medium')
            
            # Check cache
            cache_key = get_cache_key(data['text'], quality)
            cached_response = response_cache.get(cache_key)
            
            if cached_response:
                audio_data, timestamp = cached_response
                if (datetime.now() - timestamp).total_seconds() < CACHE_DURATION:
                    # Update metrics for cache hit
                    metrics.cache_hit = True
                    
                    # Return cached response
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(audio_data)))
                    self.send_header('X-Cache', 'HIT')
                    self.send_header('X-Response-Time', f'{metrics.duration_ms:.2f}ms')
                    self.end_headers()
                    self.wfile.write(audio_data)
                    
                    # Log metrics
                    metrics.log()
                    return
            
            # Initialize Gemini client
            api_key = os.environ.get('GOOGLE_API_KEY')
            if not api_key:
                raise ValueError("GOOGLE_API_KEY environment variable is required")
            
            genai.configure(api_key=api_key)
            client = genai.Client()
            
            # Using Google Gemini 2.0 Flash voice function with Charon configuration for audio responses
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
                    "parts": [{"text": data['text']}],
                    "role": "user"
                }],
                "turn_complete": True
            })
            
            # Get and optimize audio
            audio_data = optimize_audio(response['audio'], quality)
            
            # Cache response
            response_cache[cache_key] = (audio_data, datetime.now())
            
            # Clean old cache entries
            current_time = datetime.now()
            for key in list(response_cache.keys()):
                if (current_time - response_cache[key][1]).total_seconds() > CACHE_DURATION:
                    del response_cache[key]
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Length', str(len(audio_data)))
            self.send_header('X-Cache', 'MISS')
            self.send_header('X-Response-Time', f'{metrics.duration_ms:.2f}ms')
            self.end_headers()
            self.wfile.write(audio_data)
            
            # Log metrics
            metrics.log()
            
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
            }).encode('utf-8')
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(error_response)))
            self.end_headers()
            self.wfile.write(error_response)
