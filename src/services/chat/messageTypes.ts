/**
 * Types for AI Chat functionality
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
  timestamp: number;
  id?: string;
<<<<<<< HEAD
  metadata?: Record<string, any>;
  mediaItems?: MessageMedia[];
  isProcessing?: boolean;
  feedback?: MessageFeedback;
=======
  metadata?: Record<string, unknown>;
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
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

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'file' | 'code' | 'link';
  url?: string;
  data?: string;
  mimeType?: string;
  caption?: string;
  fileName?: string;
  fileSize?: number;
  codeLanguage?: string;
  codeContent?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
  name?: string; // Added for compatibility with some components
}

export interface MessageFeedback {
  rating?: 'positive' | 'negative';
  comment?: string;
  timestamp?: number;
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
  mediaItems?: MessageMedia[];
}

export interface MessageResponse {
  message: AIMessage;
  conversation?: ChatConversation;
}

// File attachment interface for sending files to the AI services
export interface FileAttachment {
  data: string;
  mimeType: string;
  name: string;
  type: string;
}

// Chat service types
export interface ChatServiceOptions {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

// Chat service interface definition
export interface ChatService {
  sendMessage(message: string, history?: any[], files?: FileAttachment[]): Promise<any>;
  clearHistory(): void;
}

// Gemini-specific chat service
export interface GeminiChatService extends ChatService {
  sendMultiModalMessage?(message: string, images: { data: string, mimeType: string }[]): Promise<any>;
  streamMessage?(message: string, callback: (chunk: string) => void): Promise<any>;
}
