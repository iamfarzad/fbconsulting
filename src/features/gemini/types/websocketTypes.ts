
export interface WebSocketClientOptions {
  url: string;
  clientId?: string;
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: string) => void;
  reconnectAttempts?: number;
  pingInterval?: number;
  pingTimeout?: number;
}

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface AudioChunkInfo {
  size: number;
  format: string;
}
