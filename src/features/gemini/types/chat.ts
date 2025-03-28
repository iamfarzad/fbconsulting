import { Message } from './index';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage extends Message {
  id?: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  error?: string;
  metadata?: {
    [key: string]: unknown;
  };
}
