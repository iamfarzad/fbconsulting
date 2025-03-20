
// Export components
export { CopilotProvider } from './CopilotProvider';
export { default as GoogleGenAIConfig } from './GoogleGenAIConfig';

// Export adapters
export * from './adapters';

// Re-export necessary CopilotKit types and hooks for easier access
export { useCopilotChat, useCopilotAction } from '@copilotkit/react-core';

// Utility function to initialize the Copilot with Azure OpenAI
export const initializeCopilot = (options: {
  apiKey: string;
  endpoint: string;
  deploymentName?: string;
}) => {
  // Here we would normally set up configuration or initialize services
  // This is just a placeholder structure for now
  console.log('Initializing CopilotKit with Azure OpenAI', options);
  return {
    isInitialized: true,
    options
  };
};

// Utility function to initialize the Copilot with Google GenAI
export const initializeCopilotWithGoogleAI = (options: {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}) => {
  // Here we would normally set up configuration or initialize services
  console.log('Initializing CopilotKit with Google GenAI', options);
  return {
    isInitialized: true,
    options
  };
};
