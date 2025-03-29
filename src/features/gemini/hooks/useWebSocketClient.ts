
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '@/config/apiConfig';

/**
 * Hook for managing WebSocket connections with automatic reconnection
 */
export function useWebSocketClient(clientId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesQueueRef = useRef<any[]>([]);
  const handlersRef = useRef<{
    onMessage?: (data: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: string) => void;
    onBinaryMessage?: (data: Blob) => void;
  }>({});
  
  /**
   * Configure message handlers
   */
  const setHandlers = useCallback((handlers: {
    onMessage?: (data: any) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: string) => void;
    onBinaryMessage?: (data: Blob) => void;
  }) => {
    handlersRef.current = handlers;
  }, []);
  
  /**
   * Establish WebSocket connection
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      
      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.error("WebSocket connection timeout");
          ws.close();
          setIsConnecting(false);
          setError("Connection timeout");
          if (handlersRef.current.onError) {
            handlersRef.current.onError("Connection timeout");
          }
        }
      }, API_CONFIG.WEBSOCKET.CONNECT_TIMEOUT);
      
      ws.onopen = () => {
        console.log("WebSocket connected");
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Process any queued messages
        while (messagesQueueRef.current.length > 0) {
          const message = messagesQueueRef.current.shift();
          ws.send(typeof message === 'string' ? message : JSON.stringify(message));
        }
        
        if (handlersRef.current.onConnect) {
          handlersRef.current.onConnect();
        }
      };
      
      ws.onmessage = (event) => {
        try {
          // Handle binary data
          if (event.data instanceof Blob) {
            console.log("Received binary message");
            if (handlersRef.current.onBinaryMessage) {
              handlersRef.current.onBinaryMessage(event.data);
            }
            return;
          }
          
          // Handle text/JSON messages
          const data = JSON.parse(event.data);
          
          if (data.type === 'error') {
            console.error("WebSocket error from server:", data.error);
            setError(data.error);
            if (handlersRef.current.onError) {
              handlersRef.current.onError(data.error);
            }
          } else if (handlersRef.current.onMessage) {
            handlersRef.current.onMessage(data);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };
      
      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        clearTimeout(connectionTimeout);
        setError("WebSocket connection error");
        setIsConnecting(false);
        
        if (handlersRef.current.onError) {
          handlersRef.current.onError("WebSocket connection error");
        }
      };
      
      ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
        clearTimeout(connectionTimeout);
        setIsConnected(false);
        setIsConnecting(false);
        
        if (handlersRef.current.onDisconnect) {
          handlersRef.current.onDisconnect();
        }
        
        // Attempt to reconnect if not explicitly closed by the client
        if (!event.wasClean && reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS})...`);
          
          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
          }
          
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, API_CONFIG.WEBSOCKET.RECONNECT_DELAY * reconnectAttemptsRef.current);
        } else if (reconnectAttemptsRef.current >= API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          setError("WebSocket connection closed. Max reconnection attempts reached.");
        }
      };
      
      wsRef.current = ws;
    } catch (e) {
      console.error("Error creating WebSocket:", e);
      setError("Failed to create WebSocket connection");
      setIsConnecting(false);
      setIsConnected(false);
      
      if (handlersRef.current.onError) {
        handlersRef.current.onError("Failed to create WebSocket connection");
      }
    }
  }, [clientId]);
  
  /**
   * Close the WebSocket connection
   */
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Client disconnected");
      wsRef.current = null;
    }
    
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    messagesQueueRef.current = [];
  }, []);
  
  /**
   * Send a message through the WebSocket
   */
  const sendMessage = useCallback((message: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not connected, queueing message");
      messagesQueueRef.current.push(message);
      
      // Try to reconnect
      if (!isConnecting && !isConnected) {
        connect();
      }
      
      return false;
    }
    
    try {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      wsRef.current.send(data);
      return true;
    } catch (e) {
      console.error("Error sending WebSocket message:", e);
      setError("Failed to send message");
      
      if (handlersRef.current.onError) {
        handlersRef.current.onError("Failed to send message");
      }
      
      return false;
    }
  }, [connect, isConnected, isConnecting]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);
  
  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    setHandlers
  };
}

export default useWebSocketClient;
