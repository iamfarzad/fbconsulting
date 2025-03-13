
// Export components
export { CopilotProvider } from './CopilotProvider';
export { CopilotChat } from './CopilotChat';

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
