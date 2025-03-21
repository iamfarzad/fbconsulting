// Core Components
export { CopilotChat } from './core/CopilotChat';
export { CopilotConfig } from './core/CopilotConfig';
export { GeminiChat } from './core/GeminiChat';

// Providers - explicit paths to avoid confusion
export { CopilotProvider } from './providers/CopilotProvider';
export { GeminiProvider, useGemini } from './providers/GeminiProvider';
export { GoogleGenAIConfig } from './providers/GoogleGenAIConfig';

// UI Components
export { ConnectionStatusIndicator } from './ui/ConnectionStatusIndicator';
export { DocumentPreview } from './ui/DocumentPreview';
export { AnimatedBars } from './ui/AnimatedBars';

// Chat Components
export { ChatHeader } from './chat/ChatHeader';
export { ChatMessages } from './chat/ChatMessages';
export { ChatInputArea } from './chat/ChatInputArea';
export { ErrorDisplay } from './chat/ErrorDisplay';

// Common Types
export type { Message, WebSocketMessage, MessageHandler, VoiceConfig, ChatConfig } from './types';

// API Types
export type {
  StreamResponse,
  AudioResponse,
  VisionResponse,
  ChatRequest,
  AudioRequest,
  VisionRequest,
  WebSocketRequest,
  WebSocketResponse,
  FluidComputeConfig,
  APIError,
  HealthCheckResponse
} from './api/types';

// Re-export necessary CopilotKit types and hooks
export {
  useCopilotChat,
  useCopilotAction
} from '@copilotkit/react-core';

// Initialization utilities
export const initializeCopilotWithGoogleAI = (options: {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}) => {
  console.log('Initializing CopilotKit with Google GenAI', {
    ...options,
    apiKey: '[REDACTED]'
  });
  return {
    isInitialized: true,
    options: {
      ...options,
      apiKey: '[REDACTED]'
    }
  };
};
