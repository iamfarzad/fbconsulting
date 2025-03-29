
import API_CONFIG from '@/config/apiConfigConfig'; // Use updated config
import { formatErrorMessage } from '@/utils/errorHandling';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketClientOptions, WebSocketMessage, AudioChunkInfo } from '../types/websocketTypes';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string; 
  private options: WebSocketClientOptions;
  private reconnectAttempts = 0;
  private pingIntervalId: NodeJS.Timeout | null = null;
  private connectionTimeoutId: NodeJS.Timeout | null = null;
  private clientId: string;
  private suppressErrors: boolean;
  private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private hasReportedInitialError = false;

  constructor(passedOptions?: Partial<WebSocketClientOptions>) {
    // Merge default options with passed options
    this.options = {
      autoReconnect: true,
      reconnectAttempts: API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS,
      pingInterval: API_CONFIG.DEFAULT_PING_INTERVAL,
      debug: false,
      suppressErrors: false,
      ...passedOptions // Passed options override defaults
    };
    
    this.clientId = this.options.clientId || uuidv4();
    
    // Get base URL and path from API_CONFIG
    const wsBaseUrl = API_CONFIG.WS_BASE_URL;
    const wsPath = API_CONFIG.WEBSOCKET.PATH;
    
    // Log config being used
    console.log(`[WebSocketClient Constructor ${this.clientId}] Using config:`, { 
      wsBaseUrl, 
      wsPath 
    });

    // Construct the full WebSocket URL using API_CONFIG
    this.url = `${wsBaseUrl}${wsPath}${this.clientId}`;
    this.suppressErrors = this.options.suppressErrors;
    
    if (this.options.debug) {
      console.log(`[WebSocketClient Constructor ${this.clientId}] Final URL: ${this.url}`);
    }
  }

  connect(): void {
    if (this.connectionState !== 'disconnected') {
      if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Connect called but state is ${this.connectionState}`);
      return;
    }

    try {
      this.connectionState = 'connecting';
      // Log URL right before creating WebSocket
      console.log(`[WebSocketClient ${this.clientId}] >>> Attempting connect to: ${this.url}`); 

      if (typeof WebSocket === 'undefined') throw new Error('WebSocket not supported');
      
      this.ws = new WebSocket(this.url);

      // Clear previous timeouts
      if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error(`[WebSocketClient ${this.clientId}] Connection timeout`);
          this.ws.close(1001, "Connection Timeout"); 
        }
      }, API_CONFIG.WEBSOCKET.CONNECT_TIMEOUT); 

      this.ws.onopen = () => {
        if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Connected.`);
        this.connectionState = 'connected';
        this.hasReportedInitialError = false;
        if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId); this.connectionTimeoutId = null;
        this.reconnectAttempts = 0;
        this.setupPing();
        this.options.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data) as WebSocketMessage;
            if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Msg In:`, data);
            this.options.onMessage?.(data);
          } 
          else if (event.data instanceof Blob) {
            if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Bin In: ${event.data.size} bytes`);
            event.data.arrayBuffer().then(buffer => {
              const audioInfo: AudioChunkInfo = { size: buffer.byteLength, format: 'mp3' };
              this.options.onAudioChunk?.(audioInfo, buffer);
            }).catch(err => console.error(`[WebSocketClient ${this.clientId}] Error getting ArrayBuffer:`, err));
          }
        } catch (error) {
          console.error(`[WebSocketClient ${this.clientId}] Error processing message:`, error);
        }
      };

      this.ws.onerror = (event) => {
        if (!this.suppressErrors || !this.hasReportedInitialError) {
          const msg = `[WebSocketClient ${this.clientId}] Error`;
          if (!this.suppressErrors) console.error(msg, event);
          else { console.warn(`[WebSocketClient ${this.clientId}] Connection unavailable - suppressing errors`); this.hasReportedInitialError = true; }
          this.options.onError?.(msg);
        }
      };

      this.ws.onclose = (event) => {
        this.connectionState = 'disconnected';
        if (this.options.debug && !this.suppressErrors) {
          console.log(`[WebSocketClient ${this.clientId}] Closed: ${event.code} ${event.reason}`);
        }
        if (this.pingIntervalId) clearInterval(this.pingIntervalId); this.pingIntervalId = null;
        if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId); this.connectionTimeoutId = null;
        
        this.options.onClose?.();
        
        const maxReconnectAttempts = this.options.reconnectAttempts ?? API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS;
        if (this.options.autoReconnect && this.reconnectAttempts < maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1);
          if (this.options.debug && !this.suppressErrors) {
            console.log(`[WebSocketClient ${this.clientId}] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxReconnectAttempts})`);
          }
          setTimeout(() => this.connect(), delay);
        } else if (this.reconnectAttempts >= maxReconnectAttempts) {
          this.suppressErrors = true; 
        }
      };
    } catch (error) {
      this.connectionState = 'disconnected';
      const errorMessage = formatErrorMessage(error);
      if (!this.suppressErrors) console.error(`[WebSocketClient ${this.clientId}] Failed to create WS: ${errorMessage}`);
      this.options.onError?.(errorMessage);
      const maxReconnectAttempts = this.options.reconnectAttempts ?? API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS;
      if (this.options.autoReconnect && this.reconnectAttempts < maxReconnectAttempts){
         setTimeout(() => this.connect(), API_CONFIG.WEBSOCKET.RECONNECT_DELAY);
      }
    }
  }

  disconnect(): void {
    if (this.pingIntervalId) clearInterval(this.pingIntervalId); this.pingIntervalId = null;
    if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId); this.connectionTimeoutId = null;
    if (this.ws) {
      this.options.autoReconnect = false; // Prevent reconnect on manual disconnect
      this.ws.close(1000, "Client disconnected intentionally");
      this.ws = null;
      this.connectionState = 'disconnected';
       if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Disconnected manually.`);
    }
  }

  send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (!this.suppressErrors) console.error(`[WebSocketClient ${this.clientId}] WS not connected, cannot send`);
      return false;
    }
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      if (this.options.debug) console.log(`[WebSocketClient ${this.clientId}] Msg Out:`, JSON.parse(message));
      this.ws.send(message);
      return true;
    } catch (error) {
      if (!this.suppressErrors) console.error(`[WebSocketClient ${this.clientId}] Error sending message:`, error);
      return false;
    }
  }

  private setupPing(): void {
    if (this.pingIntervalId) clearInterval(this.pingIntervalId);
    const interval = this.options.pingInterval!;
    if (interval > 0) {
        this.pingIntervalId = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          if (this.options.debug) console.debug(`[WebSocketClient ${this.clientId}] Sending ping`);
          this.send({ type: 'ping' });
        }
      }, interval);
    }
  }

  isConnected(): boolean { return this.connectionState === 'connected'; }
  getClientId(): string { return this.clientId; }
  enableErrorSuppression(suppress: boolean = true): void { this.suppressErrors = suppress; }
}
