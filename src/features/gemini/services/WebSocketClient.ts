
import API_CONFIG from '@/config/apiConfig'; // Use updated config
import { formatErrorMessage } from '@/utils/errorHandling';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketClientOptions, WebSocketMessage, AudioChunkInfo } from '../types/websocketTypes';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string; 
  private options: WebSocketClientOptions;
  private reconnectAttempts = 0;
  private pingIntervalId: NodeJS.Timeout | null = null; // Use NodeJS.Timeout for clarity
  private connectionTimeoutId: NodeJS.Timeout | null = null; // Use NodeJS.Timeout
  private clientId: string;
  private suppressErrors: boolean;
  private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private hasReportedInitialError = false;

  constructor(passedOptions?: Partial<WebSocketClientOptions>) { // Make options optional
    // Merge default options with passed options
    this.options = {
      // No default URL here, construct it below
      autoReconnect: true,
      reconnectAttempts: API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS,
      pingInterval: API_CONFIG.DEFAULT_PING_INTERVAL,
      debug: false,
      suppressErrors: false,
      ...passedOptions // Passed options override defaults
    };
    
    // Generate or use client ID
    this.clientId = this.options.clientId || uuidv4();
    
    // Construct the full WebSocket URL using API_CONFIG correctly
    // Use WS_BASE_URL (wss://...) and WEBSOCKET.PATH (/ws/)
    this.url = `${API_CONFIG.WS_BASE_URL}${API_CONFIG.WEBSOCKET.PATH}${this.clientId}`;
    
    this.suppressErrors = this.options.suppressErrors;
    
    if (this.options.debug) {
      console.log(`WebSocketClient created. URL: ${this.url}, Client ID: ${this.clientId}`);
    }
  }

  connect(): void {
    if (this.connectionState !== 'disconnected') {
      if (this.options.debug) console.log(`WebSocket already ${this.connectionState}`);
      return;
    }

    try {
      this.connectionState = 'connecting';
      if (this.options.debug) console.log(`Connecting to: ${this.url}`);
      if (typeof WebSocket === 'undefined') throw new Error('WebSocket not supported');
      
      this.ws = new WebSocket(this.url);

      // Clear previous timeouts
      if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId);
      this.connectionTimeoutId = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          this.ws.close(1001, "Connection Timeout"); // Use standard code
        }
      }, API_CONFIG.WEBSOCKET.CONNECT_TIMEOUT); // Use configured timeout

      this.ws.onopen = () => {
        if (this.options.debug) console.log('WebSocket connected');
        this.connectionState = 'connected';
        this.hasReportedInitialError = false;
        if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId);
        this.connectionTimeoutId = null;
        this.reconnectAttempts = 0;
        this.setupPing();
        this.options.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data) as WebSocketMessage;
            if (this.options.debug) console.log('WS Msg In:', data);
            this.options.onMessage?.(data);
          } 
          else if (event.data instanceof Blob) {
            if (this.options.debug) console.log(`WS Bin In: ${event.data.size} bytes`);
            event.data.arrayBuffer().then(buffer => {
              const audioInfo: AudioChunkInfo = { size: buffer.byteLength, format: 'mp3' }; // Assume mp3
              this.options.onAudioChunk?.(audioInfo, buffer);
            }).catch(err => console.error("Error getting ArrayBuffer from Blob:", err));
          }
        } catch (error) {
          console.error('Error processing WS message:', error);
        }
      };

      this.ws.onerror = (event) => {
        if (!this.suppressErrors || !this.hasReportedInitialError) {
          const msg = `WebSocket error`;
          if (!this.suppressErrors) console.error(msg, event);
          else { console.warn('WS connection unavailable - suppressing errors'); this.hasReportedInitialError = true; }
          this.options.onError?.(msg);
        }
        // Let onclose handle state and reconnect attempt
      };

      this.ws.onclose = (event) => {
        this.connectionState = 'disconnected';
        if (this.options.debug && !this.suppressErrors) {
          console.log(`WS closed: ${event.code} ${event.reason}`);
        }
        if (this.pingIntervalId) clearInterval(this.pingIntervalId); this.pingIntervalId = null;
        if (this.connectionTimeoutId) clearTimeout(this.connectionTimeoutId); this.connectionTimeoutId = null;
        
        this.options.onClose?.();
        
        if (this.options.autoReconnect && this.reconnectAttempts < this.options.reconnectAttempts!) {
          this.reconnectAttempts++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1);
          if (this.options.debug && !this.suppressErrors) {
            console.log(`WS Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.options.reconnectAttempts})`);
          }
          setTimeout(() => this.connect(), delay);
        } else if (this.reconnectAttempts >= this.options.reconnectAttempts!) {
          this.suppressErrors = true; // Suppress after max attempts
        }
      };
    } catch (error) {
      this.connectionState = 'disconnected';
      const errorMessage = formatErrorMessage(error);
      if (!this.suppressErrors) console.error(`Failed to create WS: ${errorMessage}`);
      this.options.onError?.(errorMessage);
      // Attempt reconnect if autoReconnect is true and error occurred during creation
      if (this.options.autoReconnect && this.reconnectAttempts < this.options.reconnectAttempts!){
         // Trigger reconnect logic similar to onclose
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
       if (this.options.debug) console.log('WebSocket disconnected manually.');
    }
  }

  send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (!this.suppressErrors) console.error('WS not connected, cannot send');
      return false;
    }
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      if (this.options.debug) console.log('WS Msg Out:', JSON.parse(message)); // Log parsed JSON
      this.ws.send(message);
      return true;
    } catch (error) {
      if (!this.suppressErrors) console.error('Error sending WS message:', error);
      return false;
    }
  }

  private setupPing(): void {
    if (this.pingIntervalId) clearInterval(this.pingIntervalId);
    const interval = this.options.pingInterval!;
    if (interval > 0) {
        this.pingIntervalId = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          if (this.options.debug) console.debug('Sending client ping via WebSocketClient');
          this.send({ type: 'ping' });
        }
      }, interval);
    }
  }

  isConnected(): boolean { return this.connectionState === 'connected'; }
  getClientId(): string { return this.clientId; }
  enableErrorSuppression(suppress: boolean = true): void { this.suppressErrors = suppress; }
}
