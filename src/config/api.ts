
// Connection settings for the Python backend
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  TIMEOUT: 30000,
  HEALTH_CHECK: '/health',
  GEMINI: {
    CHAT: '/gemini/chat',
    AUDIO: '/gemini/audio',
    STREAM: '/gemini/stream',
    VISION: '/gemini/vision'
  },
  WEBSOCKET: {
    RECONNECT_ATTEMPTS: 3,
    RECONNECT_INTERVAL: 3000,
    PING_INTERVAL: 30000,
    PING_TIMEOUT: 10000
  },
  DEFAULT_WS_PING_INTERVAL: 30000,
  DEFAULT_WS_PING_TIMEOUT: 10000
};

export default API_CONFIG;
