
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string; // Make id optional
  mediaItems?: MessageMedia[];
  feedback?: 'positive' | 'negative' | null;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface MessageMedia {
  type: 'image' | 'document' | 'code' | 'link';
  url?: string;
  data: string;
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

export interface ChatConfig {
  apiKey?: string;
  modelName?: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface FileAttachment {
  mimeType: string;
  data: string;
  name: string;
  type: string;
}

export interface ChatSessionState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
}

// Adding lead stage type definition to fix type errors
export type LeadStage = 
  'initial' | 
  'discovery' | 
  'evaluation' | 
  'decision' | 
  'implementation' | 
  'retention' |
  'qualification' | 
  'interested' | 
  'ready-to-book';
