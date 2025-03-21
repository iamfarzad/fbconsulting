
// Basic message types
export interface Message {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

export interface AIMessage extends Message {
  media?: MessageMedia[];
  isLoading?: boolean;
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'document' | 'code' | 'link';
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
}

// Form types that can be embedded in messages
export type FormType = 'email-summary' | 'newsletter-signup' | 'booking-request' | 'contact-form';

export interface FormData {
  type: FormType;
  data?: Record<string, string>;
}

// Card types for structured display
export interface Card {
  title: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  subtitle?: string;
}
