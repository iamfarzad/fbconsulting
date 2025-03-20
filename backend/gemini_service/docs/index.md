# Gemini Service Documentation

Welcome to the Gemini Service documentation. This service provides WebSocket-based chat and text-to-speech functionality using Google's Gemini API.

## Quick Navigation

- [Quick Start Guide](../QUICKSTART.md) - Get up and running quickly
- [Configuration Guide](../.env.example) - Available configuration options
- [Docker Setup](../docker-compose.yml) - Container configuration
- [Development Commands](../Makefile) - Available make commands

## Component Documentation

### Core Components
- **Main Service** ([main.py](../main.py))
  - WebSocket server implementation
  - Connection management
  - Health monitoring

- **Gemini Client** ([gemini_client.py](../gemini_client.py))
  - Gemini API integration
  - Audio synthesis
  - Chat session management

### Testing & Debugging
- **WebSocket Testing** ([test_websocket.py](../test_websocket.py))
  - Manual WebSocket testing
  - Audio file generation

- **Integration Tests** ([test_gemini_service.py](../test_gemini_service.py))
  - Automated test suite
  - Performance testing
  - Audio quality verification

- **Debug Utilities** ([debug_utils.py](../debug_utils.py))
  - Performance metrics
  - Audio analysis
  - Waveform visualization

## Deployment

### Local Development
```bash
# Setup
make setup

# Start service
make start

# Run tests
make test
```

### Docker Deployment
```bash
# Setup and start
make docker-setup
make docker-start

# Monitor
make logs
```

## API Reference

### WebSocket Endpoints
- `/ws/{client_id}` - Main WebSocket endpoint

### HTTP Endpoints
- `/health` - Health check endpoint

### WebSocket Messages

#### Client to Server
```json
{
  "text": "Message content",
  "role": "user",
  "enableTTS": true
}
```

#### Server to Client
```json
{
  "type": "text|error|audio|audio_meta|complete|pong",
  "content": "Response content",
  "error": "Error message if applicable"
}
```

## Performance Tuning

### Audio Settings
- Chunk size: 32KB default
- Sample rate: 48kHz
- Channels: 2 (stereo)
- Bit depth: 16-bit

### WebSocket Settings
- Ping interval: 30s
- Ping timeout: 10s
- Max connections: 100

## Troubleshooting

### Common Issues
1. Connection failures
2. Audio playback issues
3. Performance problems

### Debugging Tools
```bash
# Performance testing
python debug_utils.py --messages 5

# Audio analysis
python debug_utils.py --save-audio

# Connection testing
python test_websocket.py
```

## Contributing

1. Check existing issues
2. Run tests before submitting PR
3. Follow code style guidelines
4. Update documentation

## License

MIT License - See [LICENSE](../LICENSE) for details

## Support

- Create issues for bugs
- Join discussions for features
- Check FAQ in README
