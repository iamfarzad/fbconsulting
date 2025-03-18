# Gemini Multimodal Service

This microservice provides audio synthesis capabilities using Google's Gemini Multimodal Live API. It acts as a bridge between the frontend application and Gemini's audio features.

## Features

- Real-time audio synthesis using Gemini's Multimodal Live API
- WebSocket-based communication for streaming audio
- Support for the Charon voice model
- Handles both text and audio responses

## Prerequisites

- Python 3.11 or higher
- Google API Key with access to Gemini API
- Node.js (for the frontend application)

## Setup

1. Create a `.env` file in the `backend/gemini_service` directory:
```env
GOOGLE_API_KEY=your_api_key_here
```

2. Install dependencies:
```bash
cd backend/gemini_service
pip install -r requirements.txt
```

3. Run the service:
```bash
python main.py
```

The service will start on `http://localhost:8000`.

## Docker Setup

1. Build the Docker image:
```bash
cd backend/gemini_service
docker build -t gemini-service .
```

2. Run the container:
```bash
docker run -p 8000:8000 -e GOOGLE_API_KEY=your_api_key_here gemini-service
```

## API Documentation

### WebSocket Endpoint

- URL: `ws://localhost:8000/ws/{client_id}`
- The `client_id` is a unique identifier for each client connection

### Message Format

Send messages to the WebSocket in this format:
```json
{
  "text": "Text to synthesize",
  "role": "user"
}
```

### Response Format

The service will respond with either:
- Binary audio data (when synthesis is successful)
- JSON error message:
```json
{
  "error": "Error message"
}
```

## Integration with Frontend

The frontend TypeScript service (`googleGenAIService.ts`) is already configured to connect to this microservice. It will:
1. Establish a WebSocket connection
2. Send text to be synthesized
3. Play received audio using the Web Audio API

## Error Handling

The service implements robust error handling:
- Connection errors
- API errors
- Audio synthesis errors

All errors are logged and sent back to the client for proper handling.

## Development

To run in development mode with auto-reload:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

You can test the WebSocket connection using wscat:
```bash
wscat -c ws://localhost:8000/ws/test
```
