
// Define a union of allowed media types for strict typing
export type MediaType = 'image' | 'document' | 'code' | 'link';

export interface MessageMedia {
  type: MediaType;
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

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

// Speech recognition types (simplified)
export interface SpeechRecognitionResult {
  isFinal: boolean;
  transcript: string;
  confidence: number;
}

// Browser SpeechRecognition API interface
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
  }
}
