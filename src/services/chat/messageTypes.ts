
// Basic message types for the chat service
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  media?: Array<{
    type: 'image' | 'document' | 'text/plain' | 'image/jpeg'; // Added the missing media types from the error
    data: string;
    mimeType?: string;
    name?: string;
  }>;
  isLoading?: boolean;
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'document' | 'code' | 'link';
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
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

// ChatMessage is a type alias for AIMessage to fix imports
export type ChatMessage = AIMessage;
