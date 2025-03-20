# Gemini Service Backend

This is the backend service for handling chat, audio synthesis, and WebSocket communication with the Gemini AI model.

## Features
- Real-time chat with Gemini Pro model
- Text-to-speech synthesis with voice customization
- WebSocket streaming for audio chunks
- Configurable voice settings (rate, pitch, language)
- Automatic sentence chunking for natural pauses
- Connection heartbeat and auto-reconnect
- Detailed logging and error handling

## Prerequisites
- Python 3.11 or higher
- Google API Key with access to Gemini API
- Virtual environment (recommended)

## Quick Start

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

4. Start the service:
```bash
python start_local.py
```

The service will be available at http://localhost:8000

## Testing

1. Test WebSocket connection:
```bash
python test_websocket.py --save-audio --message "Tell me a joke about programming"
```

Options:
- `--host`: WebSocket host (default: localhost)
- `--port`: WebSocket port (default: 8000)
- `--message`: Message to send (default: "Tell me a short joke")
- `--save-audio`: Save received audio chunks to files

2. Check health endpoint:
```bash
curl http://localhost:8000/health
```

## Configuration

Environment variables in `.env`:
- `GOOGLE_API_KEY`: Your Google API key
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `LOG_LEVEL`: Logging level (default: INFO)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `DEFAULT_VOICE`: Default voice name
- `DEFAULT_LANGUAGE`: Default language code
- `WS_PING_INTERVAL`: WebSocket ping interval in seconds
- `WS_PING_TIMEOUT`: WebSocket ping timeout in seconds

## Voice Settings

Available voice settings:
- Name: Default "Charon"
- Language: Default "en-US"
- Rate: 0.25 to 4.0 (default 1.0)
- Pitch: -20.0 to 20.0 (default 0.0)

## Monitoring

- Logs are written to `gemini_service.log`
- Health check endpoint at `/health`
- Connection status in WebSocket messages
- Detailed error messages in response

## Development

- Auto-reload is enabled by default in development
- Test changes with `test_websocket.py`
- Monitor logs with:
```bash
tail -f gemini_service.log
```

## Common Issues

1. WebSocket Connection Failed:
   - Check if the backend service is running
   - Verify CORS settings in .env
   - Check firewall settings

2. Audio Not Playing:
   - Verify GOOGLE_API_KEY has access to text-to-speech
   - Check audio chunks are being received
   - Monitor browser console for errors

3. Performance Issues:
   - Adjust chunk size in gemini_client.py
   - Modify sentence splitting logic
   - Check network latency

## Production Deployment

For production:
1. Set `RELOAD=false` in .env
2. Configure proper CORS settings
3. Use proper SSL/TLS
4. Set up monitoring
5. Configure proper logging

See `.vercel/implementation.md` for Vercel deployment details.
