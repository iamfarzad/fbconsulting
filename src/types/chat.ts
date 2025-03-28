
// Basic chat message types
export interface FileAttachment {
  mimeType: string;
  data: string;
  name: string;
  type: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string; 
  media?: Array<{
    type: 'image' | 'document' | 'text/plain' | 'image/jpeg' | 'file' | 'code' | 'link';
    data: string;
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
  }>;
  isLoading?: boolean;
  feedback?: {
    rating: 'positive' | 'negative';
    comment?: string;
  };
  mediaItems?: MessageMedia[];
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

export interface ChatResponse {
  text: string;
  suggestedResponse?: string;
  leadInfo?: any;
  cards?: any[];
}

export interface FormData {
  type: string;
  fields: Record<string, string>;
}

export type ChatService = {
  sendMessage: (message: string, files?: FileAttachment[]) => Promise<ChatResponse>;
  streamMessage?: (message: string, files?: FileAttachment[]) => AsyncGenerator<string, void, unknown>;
  clearConversation: () => void;
  getMessages: () => AIMessage[];
};

// Export these to be consistent with messageTypes.ts
export const isUserMessage = (message: AIMessage): boolean => message.role === 'user';
export const isAssistantMessage = (message: AIMessage): boolean => message.role === 'assistant';
export const isSystemMessage = (message: AIMessage): boolean => message.role === 'system';
export const isErrorMessage = (message: AIMessage): boolean => message.role === 'error';

// ChatMessage is a type alias for AIMessage to fix imports
export type ChatMessage = AIMessage;
