
// API configuration constants

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001',
  DEFAULT_PING_INTERVAL: 30000, // 30 seconds
  DEFAULT_WS_PING_TIMEOUT: 10000, // 10 seconds
  DEFAULT_TIMEOUT: 60000, // 60 seconds
  DEFAULT_RECONNECT_ATTEMPTS: 3,
  DEFAULT_RETRIES: 3,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  DEFAULT_ENDPOINTS: {
    gemini: '/api/gemini',
    geminiStream: '/api/gemini/stream',
    audio: '/api/audio',
    healthCheck: '/api/health'
  },
  WEBSOCKET: {
    DEFAULT_PATH: '/ws',
    DEFAULT_PROTOCOL: 'gemini-protocol',
    PING_MESSAGE: { type: 'ping' },
    TIMEOUT: 30000, // 30 seconds
    RECONNECT_ATTEMPTS: 5, // Max reconnection attempts
    RECONNECT_INTERVAL: 5000, // 5 seconds between reconnection attempts
    PING_INTERVAL: 30000 // 30 seconds ping interval
  },
  HEALTH_CHECK: {
    ENDPOINT: '/health',
    INTERVAL: 60000 // 1 minute
  }
};

export const DEFAULT_REQUEST_OPTIONS = {
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: API_CONFIG.DEFAULT_TIMEOUT
};
