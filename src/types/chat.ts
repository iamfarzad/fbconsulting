
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
  media?: Array<{
    type: 'image' | 'document';
    data: string;
    mimeType?: string;
    name?: string;
  }>;
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
