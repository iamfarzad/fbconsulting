
import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWebSocketMessageHandlers } from './useWebSocketMessageHandlers';
import { useWebSocketPingPong } from './useWebSocketPingPong';
import { 
  constructWebSocketUrl, 
  calculateReconnectDelay,
  createTextMessage,
  createMultimodalMessage
} from '../utils/webSocketUtils';
import API_CONFIG from '@/config/apiConfig';

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
  
  // Configure ping/pong
  const pingInterval = options.pingInterval || API_CONFIG.DEFAULT_PING_INTERVAL;
  const pingTimeout = options.pingTimeout || API_CONFIG.WEBSOCKET.CONNECT_TIMEOUT;
  
  // Handler to call when ping times out
  const handlePingTimeout = useCallback(() => {
    console.warn('WebSocket ping timeout - closing connection');
    
    if (ws.current) {
      ws.current.close();
    }
    
    // Attempt to reconnect (handled by onclose event)
  }, []);
  
  // Use the ping/pong hook
  const { startPingPong, clearPingTimeout, clearTimers } = useWebSocketPingPong({
    pingInterval,
    pingTimeout,
    onPingTimeout: handlePingTimeout
  });
  
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
  
  // Use the message handlers hook
  const { handleMessage } = useWebSocketMessageHandlers({
    ...handlers,
    onError: (errorMsg) => {
      setError(errorMsg);
      if (handlers.onError) handlers.onError(errorMsg);
    }
  });
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return; // Already connected
    }
    
    try {
      setConnectionState('connecting');
      setError(null);
      
      // Get WebSocket URL
      const wsUrl = constructWebSocketUrl(clientId, options.url);
      console.log(`useGeminiWebSocket: Connecting to ${wsUrl}`);
      
      ws.current = new WebSocket(wsUrl);
      
      // Handle WebSocket events
      ws.current.onopen = () => {
        setConnectionState('connected');
        reconnectAttempt.current = 0;
        
        // Setup ping/pong
        startPingPong(ws.current!);
        
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
          const delay = calculateReconnectDelay(reconnectAttempt.current);
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
        handleMessage(event, ws.current, clearPingTimeout);
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Connection error: ${error.message}` 
        : 'Failed to establish connection';
      
      setConnectionState('disconnected');
      setError(errorMessage);
      
      if (handlers.onError) handlers.onError(errorMessage);
    }
  }, [
    clientId, 
    options.url, 
    handlers, 
    maxReconnectAttempts, 
    clearTimers, 
    startPingPong, 
    handleMessage,
    clearPingTimeout
  ]);
  
  // Send a text message
  const sendMessage = useCallback((text: string, enableTTS: boolean = true) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError('Not connected to server');
      return;
    }
    
    try {
      const message = createTextMessage(text, enableTTS);
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
      const message = createMultimodalMessage(text, files, enableTTS);
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
