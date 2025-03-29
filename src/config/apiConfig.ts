
// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  DEFAULT_PING_INTERVAL: 30000,
  DEFAULT_WS_PING_TIMEOUT: 10000,
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_RECONNECT_ATTEMPTS: 3,
  DEFAULT_RETRIES: 3,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  
  DEFAULT_ENDPOINTS: {
    GEMINI: '/api/gemini',
    CHAT: '/api/chat'
  },
  
  WEBSOCKET: {
    CONNECT_TIMEOUT: 5000,
    RECONNECT_DELAY: 2000
  },
  
  HEALTH_CHECK: {
    INTERVAL: 60000,
    ENDPOINT: '/health'
  }
};

export default API_CONFIG;
