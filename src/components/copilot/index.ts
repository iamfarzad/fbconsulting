// Core Components
export { GeminiChat } from './core/GeminiChat';
export { CopilotChat } from './core/CopilotChat';
export { CopilotConfig } from './core/CopilotConfig';

// Providers
export { CopilotProvider, useCopilot } from './providers/CopilotProvider';
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

// Common Types
export type { Message, WebSocketMessage, MessageHandler, VoiceConfig, ChatConfig } from './types';

// API Types
export type {
  // Response Types
  StreamResponse,
  AudioResponse,
  VisionResponse,
  
  // Request Types
  ChatRequest,
  AudioRequest,
  VisionRequest,
  
  // WebSocket Types
  WebSocketRequest,
  WebSocketResponse,
  
  // Configuration
  FluidComputeConfig,
  
  // Error Types
  APIError,
  
  // Health Check
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
