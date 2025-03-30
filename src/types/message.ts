// Message types shared across components
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
}

// Type for component props
export interface MessageDisplayProps {
  messages: Message[];
  isLoading?: boolean;
  isProviderLoading?: boolean;
  isListening?: boolean;
  transcript?: string;
  error?: string | null;
}

// WebSocket message types
export interface OutgoingWebSocketMessage {
  type: 'text_message' | 'multimodal_message';
  text?: string | null;
  files?: Array<{ mime_type: string; data: string; filename?: string }>;
  role?: string;
  enableTTS?: boolean;
}

export interface IncomingWebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
  size?: number;
  format?: string;
}

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}
