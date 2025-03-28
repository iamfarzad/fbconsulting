
import { API_CONFIG } from '@/config/api';
import { formatErrorMessage } from './errorHandling';

export interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
}

export interface WebSocketOptions {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  autoReconnect?: boolean;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private options: WebSocketOptions;
  private reconnectAttempts = 0;
  private pingInterval: number | null = null;
  private connectionTimeout: number | null = null;

  constructor(url: string, options: WebSocketOptions = {}) {
    this.url = url;
    this.options = {
      autoReconnect: true,
      ...options
    };
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      console.log(`Connecting to WebSocket: ${this.url}`);
      this.ws = new WebSocket(this.url);

      // Set up connection timeout
      this.connectionTimeout = window.setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          this.ws.close();
        }
      }, API_CONFIG.TIMEOUT);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.reconnectAttempts = 0;
        this.setupPing();
        if (this.options.onOpen) this.options.onOpen();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = typeof event.data === 'string' 
            ? JSON.parse(event.data) 
            : event.data;
          
          if (this.options.onMessage) this.options.onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (event) => {
        const errorMessage = `WebSocket error: ${JSON.stringify(event)}`;
        console.error(errorMessage);
        if (this.options.onError) this.options.onError(errorMessage);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        if (this.options.onClose) this.options.onClose();
        
        if (this.options.autoReconnect && this.reconnectAttempts < API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS) {
          this.reconnectAttempts++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1);
          console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS})`);
          setTimeout(() => this.connect(), delay);
        }
      };
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      console.error(`Failed to create WebSocket connection: ${errorMessage}`);
      if (this.options.onError) this.options.onError(errorMessage);
    }
  }

  disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  private setupPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, API_CONFIG.WEBSOCKET.PING_INTERVAL);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export function createWebSocketUrl(clientId: string): string {
  return `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
}

export function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15);
}
