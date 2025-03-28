
export interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
}

export interface WebSocketClientOptions {
  onOpen?: () => void;
  onMessage?: (data: WebSocketMessage) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  onAudioChunk?: (audioChunk: ArrayBuffer) => void;
  autoReconnect?: boolean;
  debug?: boolean;
}
