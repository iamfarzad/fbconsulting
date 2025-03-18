# Gemini Audio Synthesis API

This Vercel serverless function provides audio synthesis capabilities using Google's Gemini Multimodal Live API. It's designed to work seamlessly with the frontend React application.

## Features

- Real-time audio synthesis using Gemini's Multimodal Live API
- Charon voice model integration
- Error handling and validation
- Efficient audio streaming

## Setup

1. Configure Vercel Environment Variables:
```bash
vercel env add GOOGLE_API_KEY
```

2. Deploy to Vercel:
```bash
vercel
```

## API Endpoint

### POST /api/gemini_audio

Synthesize speech from text using Gemini's Multimodal Live API.

**Request Body:**
```json
{
  "text": "Text to synthesize",
  "role": "user"
}
```

**Response:**
- Success: Audio data (audio/wav)
- Error: JSON error message
```json
{
  "error": "Error message"
}
```

## Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file:
```env
GOOGLE_API_KEY=your_api_key_here
```

3. Run locally with Vercel dev:
```bash
vercel dev
```

## Integration with Frontend

The frontend's `googleGenAIService.ts` is configured to call this API endpoint. When `synthesizeSpeech()` is called, it will:

1. Send text to `/api/gemini_audio`
2. Receive audio data
3. Play the audio using Web Audio API

## Error Handling

The API implements comprehensive error handling:
- Input validation
- API errors
- Audio synthesis errors

All errors are returned with appropriate HTTP status codes and error messages.
