
// Export components
export { GeminiProvider } from './GeminiProvider';
export { GeminiChat } from './GeminiChat';

// Utility function to initialize Gemini
export const initializeGemini = (options: {
  apiKey: string;
  model?: string;
}) => {
  const modelName = options.model || 'gemini-1.5-pro';
  console.log('Initializing Gemini with model:', modelName);
  
  localStorage.setItem('GEMINI_CONFIG', JSON.stringify({
    apiKey: options.apiKey,
    modelName: modelName,
    timestamp: Date.now()
  }));
  
  return {
    isInitialized: !!options.apiKey,
    options
  };
};
