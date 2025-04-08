
/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || window.location.origin,
  DEFAULT_ENDPOINTS: {
    GEMINI: '/api/gemini',
    CHAT: '/api/chat',
    HEALTH_CHECK: '/api/health',
    VERSION: '/api/version'
  },
  TIMEOUTS: {
    DEFAULT: 30000, // 30 seconds
    LONG: 60000     // 60 seconds
  }
};

/**
 * Get Gemini API key from environment
 */
export const getGeminiApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

/**
 * Get base URL for API requests
 */
export const getApiBaseUrl = (): string => {
  return API_CONFIG.BASE_URL;
};
