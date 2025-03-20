
/**
 * Types for AI Chat functionality
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'error' | 'system';
  content: string;
  timestamp: number;
  id?: string;
  metadata?: Record<string, any>;
  mediaItems?: MessageMedia[];
  isProcessing?: boolean;
  feedback?: MessageFeedback;
}

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
