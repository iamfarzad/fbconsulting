
/**
 * Types for AI Chat functionality
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
  timestamp: number;
  id?: string;
  metadata?: Record<string, any>;
}

export type MessageRole = AIMessage['role'];

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
