
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/config/api';

interface WebSocketMessage {
  type: string;
  content?: string;
  error?: string;
  status?: string;
}

type MessageHandler = (content: string) => void;

interface GeminiContextType {
  sendMessage: (content: string) => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  resetError: () => void;
  reconnect: () => void;
}

const GeminiContext = createContext<GeminiContextType | null>(null);

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

interface GeminiProviderProps {
  children: React.ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<Map<string, MessageHandler>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connectWebSocket = useCallback(() => {
    if (isConnecting) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnecting(true);
    const clientId = Math.random().toString(36).substring(7);
    const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
    console.log('Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          
          if (data.type === 'text' && data.content) {
            messageHandlersRef.current.get('text')?.(data.content);
          }
          
          if (data.type === 'error') {
            const errorMessage = data.error || 'Unknown error';
            setError(errorMessage);
            console.error('WebSocket error message:', errorMessage);
            
            if (errorMessage.includes('API key') || errorMessage.includes('Authentication')) {
              toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
              });
            }
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error. Please try again later.');
        setIsConnected(false);
        
        if (reconnectAttemptsRef.current === 0) {
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to AI service. Some features may be limited.',
            variant: 'destructive',
          });
        }
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsConnecting(false);
        
        if (reconnectAttemptsRef.current < API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS}`);
          
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL * Math.pow(2, reconnectAttemptsRef.current - 1);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, delay);
        } else if (!error) {
          setError('Failed to connect after multiple attempts. Try again later.');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
    }
  }, [isConnecting, error]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    connectWebSocket();
    
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (e) {
          console.error('Error sending ping:', e);
        }
      }
    }, API_CONFIG.WEBSOCKET.PING_INTERVAL);
    
    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(async (content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      if (!isConnecting && reconnectAttemptsRef.current < API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS) {
        reconnect();
        throw new Error('WebSocket reconnecting, please try again in a moment');
      } else {
        throw new Error('WebSocket is not connected');
      }
    }

    const message = {
      text: content,
      role: 'user',
      enableTTS: true
    };

    return new Promise<void>((resolve, reject) => {
      try {
        wsRef.current?.send(JSON.stringify(message));
        resolve();
      } catch (error) {
        console.error('Error sending message:', error);
        reject(error);
      }
    });
  }, [isConnecting, reconnect]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    sendMessage,
    isConnected,
    isConnecting,
    error,
    resetError,
    reconnect,
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};
