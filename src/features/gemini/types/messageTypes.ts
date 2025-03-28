
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  messages: AIMessage[];
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MessageActions {
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}

export interface MessageState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
}
