
// API Configuration

// !!! IMPORTANT: Replace this hardcoded URL with environment variables for production !!!
const IDX_BACKEND_PREVIEW_URL = "8000-idx-fbconsulting-1742973637350.cluster-6yqpn75caneccvva7hjo4uejgk.cloudworkstations.dev"; 
const IS_DEVELOPMENT = import.meta.env.DEV;

// Determine base URLs based on environment
// In IDX dev environment, use the specific preview URL. Otherwise, use environment variables or defaults.
const wsProtocol = IS_DEVELOPMENT ? 'wss' : (import.meta.env.VITE_WS_PROTOCOL || 'wss'); // Default to wss
const apiProtocol = IS_DEVELOPMENT ? 'https' : (import.meta.env.VITE_API_PROTOCOL || 'https'); // Default to https

// Define base hostnames/paths
const wsBaseHost = import.meta.env.VITE_WS_BASE_HOST || (IS_DEVELOPMENT ? IDX_BACKEND_PREVIEW_URL : 'localhost:8000');
const apiBaseHost = import.meta.env.VITE_API_BASE_HOST || (IS_DEVELOPMENT ? IDX_BACKEND_PREVIEW_URL : 'localhost:8000');
const wsPath = import.meta.env.VITE_WS_PATH || '/ws/'; // Default WebSocket path

export const API_CONFIG = {
  // Construct full URLs
  BASE_URL: `${apiProtocol}://${apiBaseHost}`,
  WS_BASE_URL: `${wsProtocol}://${wsBaseHost}`, // Base URL without path
  
  DEFAULT_PING_INTERVAL: 25000, // Send client ping every 25s
  DEFAULT_WS_PING_TIMEOUT: 10000, // Timeout for server ping response
  DEFAULT_TIMEOUT: 30000, // General request timeout (unused here currently)
  DEFAULT_RECONNECT_ATTEMPTS: 3,
  DEFAULT_RETRIES: 3,
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  
  // Relative API endpoint paths
  DEFAULT_ENDPOINTS: {
    GEMINI: '/api/gemini', 
    CHAT: '/api/chat',      
    HEALTH_CHECK: '/health',  
    VERSION: '/version'    
  },
  
  // WebSocket specific settings
  WEBSOCKET: {
    PATH: wsPath, // Store the path separately
    CONNECT_TIMEOUT: 5000,
    RECONNECT_DELAY: 2000 // Initial reconnect delay
  },
  
  // Health check settings
  HEALTH_CHECK: {
    INTERVAL: 60000, // Check health every 60 seconds
  }
};

console.log("API Config Initialized:", API_CONFIG); // Log config on load for debugging

export default API_CONFIG;
