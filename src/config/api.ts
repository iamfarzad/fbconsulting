const isDevelopment = process.env.NODE_ENV === 'development';

export const API_CONFIG = {
  WS_BASE_URL: isDevelopment ? 'ws://localhost:8000' : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`,
  HTTP_BASE_URL: isDevelopment ? 'http://localhost:8000' : '',
  DEFAULT_WS_PING_INTERVAL: 30000, // 30 seconds
  DEFAULT_WS_PING_TIMEOUT: 10000,  // 10 seconds
};

export default API_CONFIG;
