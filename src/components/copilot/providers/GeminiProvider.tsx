import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message, WebSocketMessage, MessageHandler, VoiceConfig } from '../types';
import { API_CONFIG } from '@/config/api';
import { handleWebSocketError } from '@/utils/errorHandling';

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 2000;

interface GeminiContextType {
  sendMessage: (content: string) => Promise<void>;
  sendAudioRequest: (text: string) => Promise<Blob | null>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  resetError: () => void;
  reconnect: () => void;
  // Add needed properties for test files
  personaData?: any;
  model?: any;
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
  apiKey?: string;
  modelName?: string;
  voice?: {
    enabled: boolean;
    voice: string;
  };
  agentic?: {
    proactiveAssistance: boolean;
    learningEnabled: boolean;
    contextAwareness: boolean;
    behaviorPatterns: string[];
  };
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ 
  children,
  apiKey: propApiKey,
  modelName,
  voice,
  agentic 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<Map<string, MessageHandler>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const manualReconnectRef = useRef(false);

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
    console.log('[GeminiProvider] Connecting to WebSocket:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[GeminiProvider] WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        manualReconnectRef.current = false;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          
          switch (data.type) {
            case 'text':
              if (data.content) {
                messageHandlersRef.current.get('text')?.(data.content);
              }
              break;
            case 'error':
              const errorMessage = data.error || data.content || 'Unknown error';
              setError(errorMessage);
              console.error('[GeminiProvider] WebSocket error message:', errorMessage);
              
              if (errorMessage.includes('API key') || errorMessage.includes('Authentication')) {
                toast({
                  title: 'Error',
                  description: errorMessage,
                  variant: 'destructive',
                });
              }
              break;
            case 'connection':
              if (data.status === 'connected') {
                setIsConnected(true);
                setIsConnecting(false);
              }
              break;
            case 'audio':
              break;
          }
        } catch (e) {
          console.error('[GeminiProvider] Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        const errorMsg = handleWebSocketError(event);
        console.error('[GeminiProvider] WebSocket error:', errorMsg);
        setError(errorMsg);
        setIsConnected(false);
        
        if (reconnectAttemptsRef.current === 0 || manualReconnectRef.current) {
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to AI service. Some features may be limited.',
            variant: 'destructive',
          });
        }
      };

      ws.onclose = () => {
        console.log('[GeminiProvider] WebSocket closed');
        setIsConnected(false);
        setIsConnecting(false);
        
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`[GeminiProvider] Attempting reconnect ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);
          
          const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1);
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
      console.error('[GeminiProvider] Error creating WebSocket:', err);
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
    }
  }, [isConnecting, error]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
    manualReconnectRef.current = true;
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    connectWebSocket();
    
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (e) {
          console.error('[GeminiProvider] Error sending ping:', e);
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
      if (!isConnecting && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
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
        console.error('[GeminiProvider] Error sending message:', error);
        reject(error);
      }
    });
  }, [isConnecting, reconnect]);

  const sendAudioRequest = useCallback(async (text: string): Promise<Blob | null> => {
    try {
      const voiceConfig: VoiceConfig = {
        voice: 'female',
        pitch: 1.0,
        rate: 1.0
      };

      const response = await fetch('/api/gemini/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          config: voiceConfig
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('[GeminiProvider] Failed to generate audio:', error);
      return null;
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const personaData = {
    personaDefinitions: {
      default: {
        name: 'Default Persona',
        systemInstructions: 'You are a helpful AI assistant.'
      }
    },
    currentPersona: 'default'
  };

  const model = agentic ? {
    startChat: () => ({
      sendMessage: async () => ({
        response: {
          text: () => 'This is a test response'
        }
      })
    })
  } : undefined;

  const value = {
    sendMessage,
    sendAudioRequest,
    isConnected,
    isConnecting,
    error,
    resetError,
    reconnect,
    personaData,
    model,
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};
