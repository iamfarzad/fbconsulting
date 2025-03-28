
import { AIMessage, MessageMedia } from './messageTypes';

export { AIMessage, MessageMedia };

export interface UploadedFile {
  name: string;
  data: string;
  mimeType: string;
  type: string;
  size?: number;
  preview?: string;
}

export interface ChatState {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface VoiceState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

export interface GeminiConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}
