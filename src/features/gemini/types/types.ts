
// Re-export message types
export type { AIMessage, MessageMedia, ChatConfig } from './messageTypes';

// Websocket types
export type { WebSocketClientOptions, WebSocketMessage, AudioChunkInfo } from './websocketTypes';

// Gemini specific types

export interface GeminiContextType {
  isInitialized?: boolean;
  isLoading?: boolean;
  error?: string | null;
  personaData?: any;
  sendMessage?: (text: string) => Promise<any>;
  generateAudio?: (text: string) => Promise<any>;
}

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  voice?: {
    name: string;
    languageCode: string;
    pitch?: number;
    speakingRate?: number;
  };
}

export interface GeminiAdapter {
  sendMessage: (message: string) => Promise<any>;
  generateAudio?: (text: string) => Promise<any>;
  initialize: () => Promise<boolean>;
  isInitialized: boolean;
}
