# Vercel API Configuration

## Python Runtime
- Version: Python 3.12
- Specified in `runtime.txt`

## Dependencies
All services use consistent versions:
- FastAPI 0.109.0
- google-generativeai 0.3.2
- See `requirements.txt` for complete list

## Service Structure
- `/gemini/` - Core Gemini API endpoints
- `/gemini_image/` - Image processing endpoints
- `/gemini_document/` - Document processing endpoints

## Configuration
Build and runtime settings are managed in root `vercel.json`:
- Fluid Compute enabled for streaming
- Memory: 1024MB
- Max Duration: 30-60s depending on endpoint

## Environment Variables
Required:
- `GOOGLE_API_KEY` - Google AI API key

## Deployment Notes
- Uses Vercel's Python runtime
- All services share common dependency versions
- Fluid Compute optimized for streaming responses
