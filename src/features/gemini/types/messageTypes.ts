
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface MessageMedia {
  type: 'image' | 'document' | 'code' | 'link';
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
