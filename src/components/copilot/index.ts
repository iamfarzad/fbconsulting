// Export components
export { GeminiChat as CopilotChat } from './core/GeminiChat';
export * from './core/CopilotConfig';
export * from './providers/CopilotProvider';
export * from './providers/GeminiProvider';
export * from './providers/GoogleGenAIConfig';
export * from './ui/ConnectionStatusIndicator';
export * from './ui/DocumentPreview';
export * from './ui/FallbackChatUI';

// UI Components
export { AnimatedBars } from './ui/AnimatedBars';
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

// Re-export necessary CopilotKit types and hooks for easier access
export { useCopilotChat, useCopilotAction } from '@copilotkit/react-core';

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
