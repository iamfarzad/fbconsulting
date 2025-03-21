// Core Components
export { GeminiChat } from './core/GeminiChat';
export { CopilotConfig } from './core/CopilotConfig';

// Providers
export { CopilotProvider } from './providers/CopilotProvider';
export { GeminiProvider, useGemini } from './providers/GeminiProvider';
export { GoogleGenAIConfig } from './providers/GoogleGenAIConfig';

// UI Components
export { AnimatedBars } from './ui/AnimatedBars';
export { ConnectionStatusIndicator } from './ui/ConnectionStatusIndicator';
export { DocumentPreview } from './ui/DocumentPreview';

// Chat Components
export { ChatHeader } from './chat/ChatHeader';
export { ChatMessages } from './chat/ChatMessages';
export { ChatInputArea } from './chat/ChatInputArea';
export { ErrorDisplay } from './chat/ErrorDisplay';

// Adapters
export * from './adapters';

// Re-export necessary CopilotKit types and hooks
export {
  useCopilotChat,
  useCopilotAction
} from '@copilotkit/react-core';

// Types
export interface CopilotOptions {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

// Initialization utilities
export const initializeCopilotWithGoogleAI = (options: CopilotOptions) => {
  console.log('Initializing CopilotKit with Google GenAI', options);
  return {
    isInitialized: true,
    options
  };
};
