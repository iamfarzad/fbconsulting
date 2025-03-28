
// Basic message types for the chat service
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string; // Add id field for messages
  media?: Array<{
    type: 'image' | 'document' | 'text/plain' | 'image/jpeg' | 'file' | 'code' | 'link';
    data: string;
    mimeType?: string;
    name?: string;
    caption?: string; // For image descriptions
    codeContent?: string; // For code blocks
    codeLanguage?: string; // Language for code highlighting
    linkTitle?: string; // For link previews
    linkDescription?: string; // For link descriptions
    linkImage?: string; // Thumbnail for links
    fileName?: string; // For file attachments
    fileSize?: number; // Size in bytes
  }>;
  isLoading?: boolean;
  feedback?: {
    rating: 'positive' | 'negative';
    comment?: string;
  };
  mediaItems?: MessageMedia[]; // For compatibility with existing components
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'document' | 'code' | 'link' | 'file';
  url?: string;
  data?: string;
  content?: string;
  mimeType?: string;
  name?: string;
  caption?: string;
  codeContent?: string;
  codeLanguage?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
  fileName?: string;
  fileSize?: number;
}

export type FormType = 'email-summary' | 'newsletter-signup' | 'booking-request' | 'contact-form';

export interface FormData {
  type: FormType;
  data?: Record<string, string>;
}

export interface Card {
  title: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  subtitle?: string;
}

// Helper functions to check message types
export const isUserMessage = (message: AIMessage): boolean => message.role === 'user';
export const isAssistantMessage = (message: AIMessage): boolean => message.role === 'assistant';
export const isSystemMessage = (message: AIMessage): boolean => message.role === 'system';
export const isErrorMessage = (message: AIMessage): boolean => message.role === 'error';

// ChatMessage is a type alias for AIMessage to fix imports
export type ChatMessage = AIMessage;
