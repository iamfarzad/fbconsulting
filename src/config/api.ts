
/**
 * API configuration
 */
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // WebSocket base URL
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || (
    window.location.protocol === 'https:' 
      ? `wss://${window.location.host}/api`
      : `ws://${window.location.host}/api`
  ),
  
  // Default timeout in milliseconds
  TIMEOUT: 30000,
  
  // Health check endpoint
  HEALTH_CHECK: '/health',
  
  // AI model endpoints
  GEMINI: {
    CHAT: '/gemini/main',
    AUDIO: '/gemini/audio',
    STREAM: '/gemini/stream',
    VISION: '/gemini/vision'
  },
  
  // Websocket reconnection settings
  WEBSOCKET: {
    RECONNECT_ATTEMPTS: 3,
    RECONNECT_INTERVAL: 2000,
    PING_INTERVAL: 30000
  }
};
