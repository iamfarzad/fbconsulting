/**
 * Gets the Gemini API key from environment variables with proper fallbacks
 */
export function getGeminiApiKey() {
  // First check for Vite's environment variable format
  const viteApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Then check for Next.js / Node environment variable format
  const nodeApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  // Return the first available key
  return viteApiKey || nodeApiKey || '';
}

/**
 * Get base URL for API requests with proper fallbacks for different environments
 */
export function getApiBaseUrl() {
  // For client-side code in a browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // For server-side code
  return process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
}
