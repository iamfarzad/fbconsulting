import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import API_CONFIG from '@/config/apiConfigConfig';

// WebSocket connection states
type ConnectionState = 'disconnected' | 'connecting' | 'connected';

// WebSocket connection options
interface WebSocketOptions {
  url?: string;
  reconnectAttempts?: number;
  pingInterval?: number;
  pingTimeout?: number;
  clientId?: string;
}

// WebSocket event handlers
interface WebSocketHandlers {
  onTextMessage?: (text: string) => void;
  onError?: (error: string) => void;
  onAudioChunk?: (chunk: ArrayBuffer) => void;
  onAudioChunkInfo?: (info: { size: number, format: string }) => void;
  onServerPing?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onComplete?: () => void;
}

/**
 * Hook for managing WebSocket connections to Gemini service
 */
export function useGeminiWebSocket(
  handlers: WebSocketHandlers = {},
  options: WebSocketOptions = {}
) {
  // Connection state tracking
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState<string>(() => options.clientId || uuidv4());
  
  // WebSocket instance reference
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef<number>(0);
  const maxReconnectAttempts = options.reconnectAttempts || API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS;
  const pingInterval = options.pingInterval || API_CONFIG.DEFAULT_PING_INTERVAL;
  const pingTimeout = options.pingTimeout || API_CONFIG.WEBSOCKET.CONNECT_TIMEOUT;
  
  // Timers
  const pingIntervalId = useRef<number | null>(null);
  const pingTimeoutId = useRef<number | null>(null);
  
  // Get WebSocket URL from config
  const getWebSocketUrl = useCallback(() => {
    // If a custom URL was provided in options, use that
    if (options.url) return options.url;
    
    // Otherwise construct URL from API_CONFIG
    const wsBaseUrl = API_CONFIG.WS_BASE_URL;
    const wsPath = API_CONFIG.WEBSOCKET.PATH;
    return `${wsBaseUrl}${wsPath}${clientId}`;
  }, [clientId, options.url]);
    
  // Clean up timers
  const clearTimers = useCallback(() => {
    if (pingIntervalId.current) {
      clearInterval(pingIntervalId.current);
      pingIntervalId.current = null;
    }
    
    if (pingTimeoutId.current) {
      clearTimeout(pingTimeoutId.current);
      pingTimeoutId.current = null;
    }
  }, []);
  
  // Close existing connection
  const closeConnection = useCallback(() => {
    if (ws.current) {
      // Remove event listeners to prevent memory leaks
      ws.current.onopen = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.onmessage = null;
      
      if (ws.current.readyState === WebSocket.OPEN || 
          ws.current.readyState === WebSocket.CONNECTING) {
        ws.current.close();
      }
      
      ws.current = null;
    }
    
    clearTimers();
    setConnectionState('disconnected');
  }, [clearTimers]);
  
  // Setup ping/pong for keepalive
  const setupPingPong = useCallback(() => {
    // Clear existing timers
    clearTimers();
    
    // Setup ping interval
    pingIntervalId.current = window.setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        // Send ping
        ws.current.send(JSON.stringify({ type: 'ping' }));
        
        // Set timeout for pong response
        pingTimeoutId.current = window.setTimeout(() => {
          console.warn('useGeminiWebSocket: WebSocket ping timeout - no pong received');
          closeConnection();
          
          // Attempt to reconnect
          if (reconnectAttempt.current < maxReconnectAttempts) {
            reconnectAttempt.current++;
            connect();
          } else {
            setError('Connection lost. Maximum reconnection attempts reached.');
          }
        }, pingTimeout);
      }
    }, pingInterval);
  }, [clearTimers, closeConnection, maxReconnectAttempts, pingInterval, pingTimeout]);
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return; // Already connected
    }
    
    try {
      setConnectionState('connecting');
      setError(null);
      
      // Get WebSocket URL
      const wsUrl = getWebSocketUrl();
      console.log(`useGeminiWebSocket: Connecting to ${wsUrl}`);
      
      ws.current = new WebSocket(wsUrl);
      
      // Handle WebSocket events
      ws.current.onopen = () => {
        setConnectionState('connected');
        reconnectAttempt.current = 0;
        
        // Setup ping/pong
        setupPingPong();
        
        // Call onConnect handler
        if (handlers.onConnect) handlers.onConnect();
      };
      
      ws.current.onclose = (event) => {
        clearTimers();
        
        // Normal closure doesn't need reconnect
        if (event.code === 1000) {
          setConnectionState('disconnected');
          if (handlers.onDisconnect) handlers.onDisconnect();
          return;
        }
        
        // Try to reconnect
        if (reconnectAttempt.current < maxReconnectAttempts) {
          reconnectAttempt.current++;
          
          // Exponential backoff
          const delay = Math.min(API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttempt.current), 30000);
          setTimeout(() => connect(), delay);
          
          setError(`Connection closed. Reconnecting (${reconnectAttempt.current}/${maxReconnectAttempts})...`);
        } else {
          setConnectionState('disconnected');
          setError('Connection lost. Maximum reconnection attempts reached.');
          if (handlers.onDisconnect) handlers.onDisconnect();
        }
      };
      
      ws.current.onerror = (event) => {
        const errorMessage = 'WebSocket error occurred';
        setError(errorMessage);
        
        if (handlers.onError) handlers.onError(errorMessage);
        
        // No need to change state here, onclose will fire next
      };
      
      ws.current.onmessage = (event) => {
        try {
          // Handle binary messages (audio data)
          if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
            if (handlers.onAudioChunk) {
              // Convert Blob to ArrayBuffer if needed
              if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                  if (reader.result instanceof ArrayBuffer && handlers.onAudioChunk) {
                    handlers.onAudioChunk(reader.result);
                  }
                };
                reader.readAsArrayBuffer(event.data);
              } else {
                handlers.onAudioChunk(event.data);
              }
            }
            return;
          }
          
          // Handle JSON messages
          const data = JSON.parse(event.data);
          
          // Handle pong message
          if (data.type === 'pong') {
            if (pingTimeoutId.current) {
              clearTimeout(pingTimeoutId.current);
              pingTimeoutId.current = null;
            }
            return;
          }
          
          // Handle server ping
          if (data.type === 'server_ping') {
            ws.current?.send(JSON.stringify({ type: 'server_pong' }));
            if (handlers.onServerPing) handlers.onServerPing();
            return;
          }
          
          // Handle audio chunk info
          if (data.type === 'audio_chunk_info') {
            if (handlers.onAudioChunkInfo) {
              handlers.onAudioChunkInfo({
                size: data.size,
                format: data.format
              });
            }
            return;
          }
          
          // Handle complete message
          if (data.type === 'complete') {
            if (handlers.onComplete) handlers.onComplete();
            return;
          }
          
          // Handle errors
          if (data.type === 'error') {
            const errorMessage = data.error || 'Unknown error from server';
            setError(errorMessage);
            
            if (handlers.onError) handlers.onError(errorMessage);
            return;
          }
          
          // Handle text messages
          if (data.type === 'text' && data.content && handlers.onTextMessage) {
            handlers.onTextMessage(data.content);
            return;
          }
          
        } catch (err) {
          const errorMessage = err instanceof Error 
            ? `Error processing message: ${err.message}` 
            : 'Error processing message';
          
          setError(errorMessage);
          if (handlers.onError) handlers.onError(errorMessage);
        }
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Connection error: ${error.message}` 
        : 'Failed to establish connection';
      
      setConnectionState('disconnected');
      setError(errorMessage);
      
      if (handlers.onError) handlers.onError(errorMessage);
    }
  }, [clientId, getWebSocketUrl, handlers, maxReconnectAttempts, clearTimers, setupPingPong]);
  
  // Send a text message
  const sendMessage = useCallback((text: string, enableTTS: boolean = true) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('Not connected to server');
      return;
    }
    
    try {
      const message = {
        type: 'text_message',
        text,
        enableTTS,
        role: 'user'
      };
      
      ws.current.send(JSON.stringify(message));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Send error: ${error.message}` 
        : 'Failed to send message';
      
      setError(errorMessage);
      if (handlers.onError) handlers.onError(errorMessage);
    }
  }, [handlers]);
  
  // Send a multimodal message with files
  const sendMultimodalMessage = useCallback((
    text: string,
    files: { mimeType: string; data: string }[],
    enableTTS: boolean = true
  ) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('Not connected to server');
      return;
    }
    
    try {
      const message = {
        type: 'multimodal_message',
        text,
        files,
        enableTTS,
        role: 'user'
      };
      
      ws.current.send(JSON.stringify(message));
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Send error: ${error.message}` 
        : 'Failed to send multimodal message';
      
      setError(errorMessage);
      if (handlers.onError) handlers.onError(errorMessage);
    }
  }, [handlers]);
  
  // Disconnect from server
  const disconnect = useCallback(() => {
    closeConnection();
  }, [closeConnection]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);
  
  return {
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    error,
    clientId,
    connect,
    disconnect,
    sendMessage,
    sendMultimodalMessage
  };
}

export default useGeminiWebSocket;
