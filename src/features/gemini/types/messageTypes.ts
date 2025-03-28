
export interface MessageMedia {
  type: 'image' | 'document' | 'code' | 'link';
  url?: string;
  data: string; // Changed from optional to required to match chat types
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
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

export interface ChatConfig {
  apiKey?: string;
  modelName?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}
