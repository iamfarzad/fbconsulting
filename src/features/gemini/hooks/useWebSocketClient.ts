
import { useState, useEffect, useRef, useCallback } from 'react';
import API_CONFIG from '@/config/apiConfigConfig'; // Ensure we're using the right config

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
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket already connected or connecting");
      return;
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Construct the WebSocket URL using API_CONFIG
      const wsBaseUrl = API_CONFIG.WS_BASE_URL;
      const wsPath = API_CONFIG.WEBSOCKET.PATH;
      const wsUrl = `${wsBaseUrl}${wsPath}${clientId}`;
      
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
        console.log("WebSocket connected (via useWebSocketClient)");
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
            console.log("Received binary message (via useWebSocketClient)");
            if (handlersRef.current.onBinaryMessage) {
              handlersRef.current.onBinaryMessage(event.data);
            }
            return;
          }
          
          // Handle text/JSON messages
          const data = JSON.parse(event.data);
          
          if (data.type === 'error') {
            console.error("WebSocket server error (via useWebSocketClient):", data.error);
            setError(data.error);
            if (handlersRef.current.onError) {
              handlersRef.current.onError(data.error);
            }
          } else if (handlersRef.current.onMessage) {
            handlersRef.current.onMessage(data);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message (via useWebSocketClient):", e);
        }
      };
      
      ws.onerror = (event) => {
        console.error("WebSocket error (via useWebSocketClient):", event);
        clearTimeout(connectionTimeout);
        setError("WebSocket connection error");
        setIsConnecting(false);
        
        if (handlersRef.current.onError) {
          handlersRef.current.onError("WebSocket connection error");
        }
        // Let onclose handle reconnect logic
      };
      
      ws.onclose = (event) => {
        console.log("WebSocket closed (via useWebSocketClient):", event);
        clearTimeout(connectionTimeout);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null; // Clear the ref on close
        
        if (handlersRef.current.onDisconnect) {
          handlersRef.current.onDisconnect();
        }
        
        // Attempt to reconnect if not explicitly closed by the client
        // Note: Check event.code !== 1000 for intentional close
        if (event.code !== 1000 && reconnectAttemptsRef.current < API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1);
          console.log(`Attempting reconnect via useWebSocketClient (${reconnectAttemptsRef.current}/${API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS}) in ${delay}ms...`);
          
          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
          }
          
          reconnectTimerRef.current = setTimeout(() => {
            connect(); // Call self to reconnect
          }, delay);
        } else if (reconnectAttemptsRef.current >= API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS) {
          setError("WebSocket closed. Max reconnection attempts reached.");
          console.error("Max reconnection attempts reached.");
        }
      };
      
      wsRef.current = ws;
    } catch (e) {
      console.error("Error creating WebSocket (via useWebSocketClient):", e);
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
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    reconnectAttemptsRef.current = API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS; // Prevent further reconnects
    if (wsRef.current) {
      console.log("Disconnecting WebSocket manually (via useWebSocketClient)");
      wsRef.current.close(1000, "Client disconnected manually");
      wsRef.current = null;
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
      console.warn("WebSocket not connected, queueing message (via useWebSocketClient)");
      messagesQueueRef.current.push(message);
      
      // Try to connect if disconnected
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
      console.error("Error sending WebSocket message (via useWebSocketClient):", e);
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
