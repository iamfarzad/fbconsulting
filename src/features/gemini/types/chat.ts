
/**
 * Core Chat Service Types
 */

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface AIMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
  id?: string;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
  title?: string;
  metadata?: Record<string, any>;
}

export interface MessageRequest {
  content: string;
  role?: MessageRole;
  metadata?: Record<string, any>;
}

export interface MessageResponse {
  message: AIMessage;
  conversation?: ChatConversation;
}

export interface FileAttachment {
  mimeType: string;
  data: string;
  name: string;
  type: string;
}

export interface ChatServiceOptions {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatService {
  sendMessage(message: string, history?: AIMessage[], files?: FileAttachment[]): Promise<AIMessage>;
  clearHistory(): void;
}

export interface GeminiChatService extends ChatService {
  // Additional Gemini-specific methods can be added here
}
