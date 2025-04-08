
import { ReactNode } from 'react';

// Make id optional to match usage patterns throughout the codebase
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
  id?: string;
  mediaItems?: Array<{
    type: string;
    data: string;
    name?: string;
    mimeType?: string;
  }>;
}

export interface ChatComponentProps {
  theme?: 'light' | 'dark' | 'system';
  initialMessages?: AIMessage[];
  apiKey?: string;
  modelName?: string;
  systemMessage?: string;
  welcomeMessage?: string;
  placeholder?: string;
  showBranding?: boolean;
  enableAttachments?: boolean;
  className?: string;
}

export interface ChatConfig {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  systemMessage?: string;
  welcomeMessage?: string;
  enableAttachments?: boolean;
}
