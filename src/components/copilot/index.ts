
// Export components
export { GeminiProvider } from './GeminiProvider';
export { GeminiChat } from './GeminiChat';

// Utility function to initialize Gemini
export const initializeGemini = (options: {
  apiKey: string;
}) => {
  console.log('Initializing Gemini with API key', options.apiKey ? 'Valid API key provided' : 'No API key');
  return {
    isInitialized: !!options.apiKey,
    options
  };
};
