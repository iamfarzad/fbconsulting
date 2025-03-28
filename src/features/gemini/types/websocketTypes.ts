
export interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
  audio_chunk_info?: {
    size: number;
    format: string;
  };
}

export interface AudioChunkInfo {
  size: number;
  format: string;
}

export type WebSocketMessageHandler = (message: WebSocketMessage) => void;
export type AudioChunkHandler = (audioChunk: ArrayBuffer) => void;

export interface WebSocketClientOptions {
  onOpen?: () => void;
  onMessage?: WebSocketMessageHandler;
  onAudioChunk?: AudioChunkHandler;
  onError?: (error: string) => void;
  onClose?: () => void;
  autoReconnect?: boolean;
  debug?: boolean;
}

export interface WebSocketClientState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  clientId: string;
}
