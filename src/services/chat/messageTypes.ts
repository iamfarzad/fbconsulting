
/**
 * Types for AI Chat functionality
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
  timestamp: number;
  id?: string;
  metadata?: Record<string, unknown>;
}

// Type guard functions
export const isUserMessage = (message: AIMessage): boolean => {
  return message.role === 'user';
};

export const isAssistantMessage = (message: AIMessage): boolean => {
  return message.role === 'assistant';
};

export const isSystemMessage = (message: AIMessage): boolean => {
  return message.role === 'system';
};

export const isErrorMessage = (message: AIMessage): boolean => {
  return message.role === 'error';
};

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
