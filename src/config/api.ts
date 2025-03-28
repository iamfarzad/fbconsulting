
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  DEFAULT_PING_INTERVAL: 30000, // 30 seconds
  DEFAULT_WS_PING_TIMEOUT: 10000, // 10 seconds
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  DEFAULT_RECONNECT_ATTEMPTS: 3,
  DEFAULT_RETRIES: 3,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  
  DEFAULT_ENDPOINTS: {
    GEMINI: '/api/gemini',
    CHAT: '/api/chat'
  },
  
  WEBSOCKET: {
    DEFAULT_PATH: '/ws',
    PING_INTERVAL: 30000,
    PING_TIMEOUT: 10000,
    RECONNECT_INTERVAL: 3000,
    RECONNECT_ATTEMPTS: 3,
    TIMEOUT: 30000,
    PING_MESSAGE: { type: 'ping' }
  },
  
  HEALTH_CHECK: {
    ENDPOINT: '/health',
    INTERVAL: 60000 // 1 minute
  }
};
