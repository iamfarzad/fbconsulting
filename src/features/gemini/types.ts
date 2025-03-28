
// Define types for Gemini chat functionality

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface MessageMedia {
  type: 'image' | 'document' | 'code' | 'link';
  url?: string;
  data?: string;
  caption?: string;
  mimeType?: string;
  fileName?: string;
  // Code-specific properties
  codeContent?: string;
  codeLanguage?: string;
  // Link-specific properties
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
}

export interface GenAIRequest {
  prompt: string;
  model?: string;
  images?: { mimeType: string; data: string }[];
  systemInstruction?: string;
}

export interface GenAIResponse {
  text: string;
  error?: string;
}

export interface GeminiContextType {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, files?: any[]) => void;
  clearMessages: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  isInitialized?: boolean;
  isProviderLoading?: boolean;
  providerError?: string;
  currentPersonaName?: string;
  personaData?: any;
  hasApiKey?: () => boolean;
  getApiKey?: () => string;
  generateAndPlayAudio?: (text: string) => Promise<void>;
}

// Gemini chat state type
export interface GeminiState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isInitialized: boolean;
  voiceEnabled: boolean;
  transcript: string;
  aiResponse: string;
  personaName: string;
}

// Gemini chat action type
export interface GeminiAction {
  type: string;
  payload?: any;
}

// Gemini API configuration options
export interface GeminiConfig {
  apiKey?: string;
  modelName?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  enableAudio?: boolean;
  enableMultimodal?: boolean;
}

// Copilot tools & configuration
export interface SpatialContext {
  location?: string;
  container?: string;
  timestamp?: number;
  context?: Record<string, any>;
}

export interface GeminiMultimodalChat {
  sendMessage: (text: string, images?: { mimeType: string; data: string }[]) => Promise<string>;
  getMessages: () => AIMessage[];
  clearMessages: () => void;
}

// Connection status type
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// WebSocket message type
export interface WebSocketMessage {
  type: string;
  data?: any;
  error?: string;
}
