
import { useState, useCallback, useEffect, useRef } from 'react';
import { WebSocketClient } from '../services/WebSocketClient';
import { WebSocketMessage, AudioChunkInfo } from '../types/websocketTypes';
import { v4 as uuidv4 } from 'uuid';
import { API_CONFIG } from '@/config/api';

interface UseWebSocketClientOptions {
  url?: string;
  onOpen?: () => void;
  onMessage?: (data: WebSocketMessage) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  onAudioChunk?: (buffer: ArrayBuffer) => void;
  autoReconnect?: boolean;
  debug?: boolean;
  suppressErrors?: boolean;
}

export function useWebSocketClient(options: UseWebSocketClientOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState(() => uuidv4());
  const clientRef = useRef<WebSocketClient | null>(null);
  const wsUrl = options.url || API_CONFIG.WS_BASE_URL + '/ws/';
  const [hasShownError, setHasShownError] = useState(false);

  // Connect to the WebSocket server
  const connect = useCallback(() => {
    if (clientRef.current?.isConnected()) {
      console.log('WebSocket already connected');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Create a new client if one doesn't exist
      if (!clientRef.current) {
        clientRef.current = new WebSocketClient({
          url: wsUrl,
          clientId,
          debug: options.debug,
          autoReconnect: options.autoReconnect,
          suppressErrors: options.suppressErrors,
          onOpen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);
            setHasShownError(false);
            if (options.onOpen) options.onOpen();
          },
          onClose: () => {
            setIsConnected(false);
            setIsConnecting(false);
            if (options.onClose) options.onClose();
          },
          onError: (err) => {
            if (!hasShownError) {
              setError(err);
              setHasShownError(true);
              if (options.onError) options.onError(err);
            }
            setIsConnecting(false);
          },
          onMessage: (data) => {
            if (options.onMessage) options.onMessage(data);
          },
          onAudioChunk: (info: AudioChunkInfo, buffer: ArrayBuffer) => {
            if (options.onAudioChunk) options.onAudioChunk(buffer);
          }
        });
      } else {
        // Enable/disable error suppression based on options
        clientRef.current.enableErrorSuppression(options.suppressErrors || false);
      }
      
      clientRef.current.connect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to WebSocket';
      console.error('WebSocket connection error:', errorMessage);
      setError(errorMessage);
      setIsConnecting(false);
      if (options.onError && !hasShownError) {
        options.onError(errorMessage);
        setHasShownError(true);
      }
    }
  }, [clientId, wsUrl, options, hasShownError]);

  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      setIsConnected(false);
    }
  }, []);

  // Send a message through the WebSocket
  const sendMessage = useCallback((data: any) => {
    if (!clientRef.current) {
      console.error('WebSocket client not initialized');
      return false;
    }
    
    if (!clientRef.current.isConnected()) {
      console.error('WebSocket not connected');
      return false;
    }
    
    return clientRef.current.send(data);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    isConnecting,
    error,
    clientId: clientRef.current?.getClientId() || clientId
  };
}
