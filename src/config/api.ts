const isProd = import.meta.env.PROD;
const isVercel = import.meta.env.VITE_DEPLOYMENT_ENV === 'vercel';

// API Paths
export const API_PATHS = {
  GOOGLE_GENERATIVE_AI: 'https://generativelanguage.googleapis.com/v1beta',
  WEBSOCKET_BASE: isProd ? (isVercel ? 'wss://fbconsulting-24cken69i-iamfarzads-projects.vercel.app/api/gemini/stream' : 'wss://fbconsulting.vercel.app/api/gemini/stream') : 'ws://localhost:8000/ws',
  GEMINI_AUDIO: '/api/gemini/audio',
  GEMINI_STREAM: '/api/gemini/stream',
  GEMINI_MAIN: '/api/gemini/main', // Updated path to avoid conflicts
  EMAIL_SERVICE: isProd ? '/api/email' : 'http://localhost:8000/api/email',
  LEAD_CAPTURE: isProd ? '/api/lead' : 'http://localhost:8000/api/lead',
};

// General API config
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  DEFAULT_WS_PING_INTERVAL: 20000, // 20 seconds
  DEFAULT_WS_PING_TIMEOUT: 10000, // 10 seconds
  WS_BASE_URL: isProd 
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    : 'ws://localhost:8000',
};

// Make sure environment variables are accessed correctly using Vite's import.meta.env
export const apiConfig = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
};

// Ensure we're not using demo by default
export const useRealApi = true; // Force to true instead of checking for API keys

// Gemini API configuration
export const GEMINI_API_CONFIG = {
  DEFAULT_MODEL: 'gemini-1.5-flash',
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 2048,
  DEFAULT_TOP_K: 40,
  DEFAULT_TOP_P: 0.95,
  DEFAULT_SAFETY_SETTINGS: {
    HARASSMENT: 'BLOCK_MEDIUM_AND_ABOVE',
    HATE_SPEECH: 'BLOCK_MEDIUM_AND_ABOVE',
    SEXUALLY_EXPLICIT: 'BLOCK_MEDIUM_AND_ABOVE',
    DANGEROUS_CONTENT: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  API_KEY_SOURCES: {
    ENV: import.meta.env.VITE_GEMINI_API_KEY,
    LOCAL_STORAGE: 'GEMINI_CONFIG',
  },
};

// Voice configuration
export const VOICE_CONFIG = {
  DEFAULT_VOICE: 'en-US-Neural2-F',
  DEFAULT_RATE: 1.0,
  DEFAULT_PITCH: 0.0,
  DEFAULT_VOLUME: 1.0,
};

// Email service configuration
export const EMAIL_CONFIG = {
  DEFAULT_FROM: 'noreply@farzadbayat.com',
  DEFAULT_SUBJECT: 'Chat Summary from F.B Consulting',
};

export default {
  API_PATHS,
  API_CONFIG,
  GEMINI_API_CONFIG,
  VOICE_CONFIG,
  EMAIL_CONFIG,
};
