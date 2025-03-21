# MCP Servers Configuration

## Active MCP Servers
- Enabled gemini_chat_server
- Enabled voice_synthesis_server

## Server Configurations

### gemini_chat_server
- **Purpose**: Handles chat interactions using Google's Gemini 2.0 Flash model
- **API Key**: Uses VITE_GEMINI_API_KEY from environment variables
- **Model**: gemini-2.0-flash-001
- **Features**: 
  - Text generation with context awareness
  - Persona management
  - Spatial context tracking
  - User behavior analysis

### voice_synthesis_server
- **Purpose**: Handles voice synthesis for AI responses
- **API Key**: Uses GOOGLE_API_KEY from environment variables
- **Voice Model**: Charon
- **Features**:
  - Text-to-speech conversion
  - Voice parameter customization (pitch, rate)
  - Error handling and retry logic
  - Streaming audio response
