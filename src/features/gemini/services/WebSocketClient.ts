
import { API_CONFIG } from '@/config/api';
import { formatErrorMessage } from '@/utils/errorHandling';
import { v4 as uuidv4 } from 'uuid';
import { WebSocketClientOptions, WebSocketMessage, AudioChunkInfo } from '../types/websocketTypes';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private options: WebSocketClientOptions;
  private reconnectAttempts = 0;
  private pingInterval: number | null = null;
  private connectionTimeout: number | null = null;
  private clientId: string;
  private suppressErrors: boolean;
  private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private hasReportedInitialError = false;

  constructor(options: WebSocketClientOptions) {
    this.options = {
      url: API_CONFIG.WS_BASE_URL + '/ws/',
      autoReconnect: true,
      debug: false,
      suppressErrors: false,
      ...options
    };
    
    // Generate a unique client ID for this connection if not provided
    this.clientId = this.options.clientId || uuidv4();
    
    // Construct the full WebSocket URL with client ID
    this.url = `${this.options.url}${this.clientId}`;
    this.suppressErrors = this.options.suppressErrors || false;
    
    if (this.options.debug) {
      console.log(`WebSocketClient created with client ID: ${this.clientId}`);
    }
  }

  connect(): void {
    // Don't reconnect if already connected or connecting
    if (this.connectionState !== 'disconnected') {
      if (this.options.debug) {
        console.log(`WebSocket already ${this.connectionState}`);
      }
      return;
    }

    try {
      this.connectionState = 'connecting';
      
      if (this.options.debug) {
        console.log(`Connecting to WebSocket: ${this.url}`);
      }
      
      // Check for WebSocket support
      if (typeof WebSocket === 'undefined') {
        throw new Error('WebSocket is not supported in this environment');
      }
      
      this.ws = new WebSocket(this.url);

      // Set up connection timeout
      this.connectionTimeout = window.setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          this.ws.close();
        }
      }, API_CONFIG.WEBSOCKET.TIMEOUT);

      this.ws.onopen = () => {
        if (this.options.debug) {
          console.log('WebSocket connected');
        }
        
        this.connectionState = 'connected';
        this.hasReportedInitialError = false;
        
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        this.reconnectAttempts = 0;
        this.setupPing();
        
        if (this.options.onOpen) {
          this.options.onOpen();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          // Handle text messages (JSON)
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data) as WebSocketMessage;
            
            // Log the message if debug is enabled
            if (this.options.debug) {
              console.log('Received WebSocket message:', data);
            }
            
            // Call the message handler if provided
            if (this.options.onMessage) {
              this.options.onMessage(data);
            }
          } 
          // Handle binary messages (audio chunks)
          else if (event.data instanceof Blob) {
            if (this.options.debug) {
              console.log(`Received binary data: ${event.data.size} bytes`);
            }
            
            if (this.options.onAudioChunk) {
              // Convert Blob to ArrayBuffer and pass to handler
              event.data.arrayBuffer().then(buffer => {
                const audioInfo: AudioChunkInfo = {
                  size: buffer.byteLength,
                  format: 'mp3' // Default format
                };
                
                if (this.options.onAudioChunk) {
                  this.options.onAudioChunk(audioInfo, buffer);
                }
              });
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      this.ws.onerror = (event) => {
        // Only log first error or if not suppressing errors
        if (!this.suppressErrors || !this.hasReportedInitialError) {
          const errorMessage = `WebSocket error occurred`;
          if (!this.suppressErrors) {
            console.error(errorMessage, event);
          } else if (!this.hasReportedInitialError) {
            console.warn('WebSocket connection unavailable - suppressing further errors');
            this.hasReportedInitialError = true;
          }
          
          if (this.options.onError) {
            this.options.onError(errorMessage);
          }
        }
      };

      this.ws.onclose = (event) => {
        this.connectionState = 'disconnected';
        
        if (this.options.debug && !this.suppressErrors) {
          console.log(`WebSocket closed with code ${event.code}: ${event.reason}`);
        }
        
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }
        
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        if (this.options.onClose) {
          this.options.onClose();
        }
        
        if (this.options.autoReconnect && 
            this.reconnectAttempts < (this.options.reconnectAttempts || API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS)) {
          this.reconnectAttempts++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts - 1);
          
          if (this.options.debug && !this.suppressErrors) {
            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.options.reconnectAttempts || API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS})`);
          }
          
          setTimeout(() => this.connect(), delay);
        } else if (this.reconnectAttempts >= (this.options.reconnectAttempts || API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS)) {
          // Max reconnect attempts reached, enable suppression to avoid console spam
          this.suppressErrors = true;
        }
      };
    } catch (error) {
      this.connectionState = 'disconnected';
      const errorMessage = formatErrorMessage(error);
      
      if (!this.suppressErrors) {
        console.error(`Failed to create WebSocket connection: ${errorMessage}`);
      }
      
      if (this.options.onError) {
        this.options.onError(errorMessage);
      }
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
      this.connectionState = 'disconnected';
      this.ws.close(1000, "Client disconnected");
      this.ws = null;
    }
  }

  send(data: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (!this.suppressErrors) {
        console.error('WebSocket not connected');
      }
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    } catch (error) {
      if (!this.suppressErrors) {
        console.error('Error sending message:', error);
      }
      return false;
    }
  }

  private setupPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    const pingIntervalMs = this.options.pingInterval || API_CONFIG.WEBSOCKET.PING_INTERVAL;
    
    this.pingInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, pingIntervalMs);
  }

  isConnected(): boolean {
    return this.connectionState === 'connected';
  }
  
  getClientId(): string {
    return this.clientId;
  }
  
  enableErrorSuppression(suppress: boolean = true): void {
    this.suppressErrors = suppress;
  }
}
