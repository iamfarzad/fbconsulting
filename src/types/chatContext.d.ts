
import { AIMessage } from './chat';

export interface GeminiContextType {
  messages: AIMessage[];
  sendMessage: (message: { type: string; text?: string; files?: any[]; enableTTS?: boolean }) => Promise<void>;
  isProcessing?: boolean;
  isConnected?: boolean;
  error?: string | null;
  clearMessages?: () => void;
  startRecording?: () => void;
  stopRecording?: () => void;
  isRecording?: boolean;
  stopAudio?: () => void;
}
