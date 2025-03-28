
// Define types for Gemini chat functionality

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

export interface GenAIRequest {
  prompt: string;
  model?: string;
  images?: { mimeType: string; data: string }[];
  systemInstruction?: string;
}

export interface GenAIResponse {
  text: string;
  error?: string;
}

export interface GeminiContextType {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, files?: any[]) => void;
  clearMessages: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
}
