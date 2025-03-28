
export interface WebSocketConfig {
  url?: string;
  autoReconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  pingInterval?: number;
  pingTimeout?: number;
  debug?: boolean;
  protocols?: string | string[];
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: string) => void;
  onMessage?: (data: WebSocketMessage) => void;
  onAudioChunk?: (audioChunk: ArrayBuffer) => void;
}

export interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  size?: number;
  [key: string]: any;
}

export interface WebSocketTextMessage {
  type: 'text_message';
  text: string;
  enableTTS?: boolean;
  role?: 'user' | 'assistant' | 'system';
  [key: string]: any;
}

export type WebSocketSendData = WebSocketTextMessage | { type: string, [key: string]: any };
