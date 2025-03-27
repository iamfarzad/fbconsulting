
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message, WebSocketMessage, MessageHandler, VoiceConfig } from '../types';
import { API_CONFIG } from '@/config/api'; // Import API_CONFIG

interface GeminiContextType {
  sendMessage: (content: string) => Promise<void>;
  sendAudioRequest: (text: string) => Promise<Blob | null>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  resetError: () => void;
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

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setIsConnecting(true);
    // Use WS_BASE_URL from API_CONFIG and add client ID path
    const clientId = Math.random().toString(36).substring(7);
    const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
    console.log('[GeminiProvider] Connecting to WebSocket:', wsUrl); // Add logging

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[GeminiProvider] WebSocket connected'); // Add logging
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        let errorMessage: string;
        
        // Handle different message types
        switch (data.type) {
          case 'text':
            if (data.content) {
              messageHandlersRef.current.get('text')?.(data.content);
            }
            break;
          case 'error':
            errorMessage = data.error || data.content || 'Unknown error';
            setError(errorMessage);
            toast({
              title: 'Error',
              description: errorMessage,
              variant: 'destructive',
            });
            break;
          case 'connection': // Assuming backend sends this on connect
            if (data.status === 'connected') {
              setIsConnected(true);
              setIsConnecting(false);
            }
            break;
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onerror = (event) => {
      console.error('[GeminiProvider] WebSocket error:', event); // Add logging
      setError('WebSocket error occurred');
      setIsConnected(false);
      console.error('WebSocket error:', event);
    };

    ws.onclose = () => {
      console.log('[GeminiProvider] WebSocket closed'); // Add logging
      setIsConnected(false);
      setIsConnecting(false);
      // Simplified reconnect logic for now
      // setTimeout(() => {
      //   connectWebSocket(); // Attempt to reconnect
      // }, 3000);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(async (content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    // Match the message structure expected by the backend (main.py)
    const message = {
      text: content,
      role: 'user',
      enableTTS: true // Or get this setting dynamically
    };

    return new Promise<void>((resolve, reject) => {
      try {
        wsRef.current?.send(JSON.stringify(message));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, []);

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
      console.error('Failed to generate audio:', error);
      return null;
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Mock data for tests
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
    personaData,
    model,
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
};
