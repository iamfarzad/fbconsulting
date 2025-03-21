# Gemini Service Quick Start Guide

This guide will help you get the Gemini service up and running quickly, either with or without Docker.

## Prerequisites

- Python 3.11+ or Docker
- Google API Key with access to Gemini API
- Node.js 18+ (for frontend development)

## Option 1: Local Development

1. **Setup Environment**
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

2. **Start the Service**
```bash
# Start with auto-reload
make start

# Or run directly
python start_local.py
```

3. **Test the Service**
```bash
# Run WebSocket tests
make test

# Run performance tests
python debug_utils.py --messages 5 --save-audio
```

## Option 2: Docker Development

1. **Setup Environment**
```bash
# Copy environment file
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

2. **Start with Docker**
```bash
# Build and start services
make docker-setup
make docker-start

# View logs
make logs
```

3. **Run Tests in Container**
```bash
# Run tests
docker-compose exec gemini_service python test_gemini_service.py

# Run debug utils
docker-compose exec gemini_service python debug_utils.py --messages 5
```

## Development Commands

```bash
# View available commands
make help

# Start local development
make start

# Run tests
make test

# Run linting
make lint

# Clean up
make clean

# View logs
make watch-logs
```

## Testing Audio Quality

1. **Generate Test Audio**
```bash
python debug_utils.py --save-audio --messages 3
```

2. **Analyze Results**
- Check `debug_output/` for audio files and waveforms
- View performance metrics in JSON reports
- Monitor `gemini_service.log` for detailed logs

## Common Issues & Solutions

1. **WebSocket Connection Failed**
   - Check if service is running
   - Verify CORS settings in .env
   - Check firewall settings

2. **Audio Not Playing**
   - Verify GOOGLE_API_KEY has TTS access
   - Check browser console for errors
   - Monitor WebSocket messages with debug_utils.py

3. **Performance Issues**
   - Adjust CHUNK_SIZE in .env
   - Modify WS_PING_INTERVAL
   - Check network latency

## Monitoring & Debugging

1. **View Logs**
```bash
# Watch logs in real-time
tail -f gemini_service.log

# Or using make
make watch-logs
```

2. **Monitor Performance**
```bash
# Run performance tests
python debug_utils.py --messages 10

# View metrics
curl http://localhost:8000/health
```

3. **Debug Audio**
```bash
# Generate test audio samples
make generate-samples

# Analyze specific response
python debug_utils.py --messages 1 --save-audio
```

## Next Steps

1. Review the full documentation in README.md
2. Check configuration options in .env.example
3. Explore advanced features in the debug_utils.py
4. Integrate with your frontend application

## Additional Resources

- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [WebSocket Protocol Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Audio Streaming Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)

## Support

- Create an issue for bugs or feature requests
- Check existing issues for common problems
- Review the troubleshooting guide in README.md
