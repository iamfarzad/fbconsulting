
// Define message types for chat functionality

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface ChatConfig {
  apiKey?: string;
  modelName?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface FileAttachment {
  mimeType: string;
  data: string;
  name: string;
  type: string;
}

export interface ChatSessionState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
}
