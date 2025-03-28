
import { useState, useCallback, useEffect, useRef } from 'react';
import { WebSocketClient } from '../services/WebSocketClient';
import { WebSocketMessage } from '../types/websocketTypes';
import { v4 as uuidv4 } from 'uuid';
import { API_CONFIG } from '@/config/api';

interface UseWebSocketClientOptions {
  onOpen?: () => void;
  onMessage?: (data: WebSocketMessage) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  onAudioChunk?: (audioChunk: ArrayBuffer) => void;
  autoReconnect?: boolean;
  debug?: boolean;
}

export function useWebSocketClient(options: UseWebSocketClientOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState(() => uuidv4());
  const clientRef = useRef<WebSocketClient | null>(null);

  // Connect to the WebSocket server
  const connect = useCallback(() => {
    if (clientRef.current?.isConnected()) {
      console.log('WebSocket already connected');
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Create a new client if one doesn't exist
      if (!clientRef.current) {
        clientRef.current = new WebSocketClient({
          debug: options.debug,
          autoReconnect: options.autoReconnect,
          onOpen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);
            if (options.onOpen) options.onOpen();
          },
          onClose: () => {
            setIsConnected(false);
            setIsConnecting(false);
            if (options.onClose) options.onClose();
          },
          onError: (err) => {
            setError(err);
            setIsConnecting(false);
            if (options.onError) options.onError(err);
          },
          onMessage: (data) => {
            if (options.onMessage) options.onMessage(data);
          },
          onAudioChunk: (audioChunk) => {
            if (options.onAudioChunk) options.onAudioChunk(audioChunk);
          }
        });
      }
      
      clientRef.current.connect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to WebSocket';
      console.error('WebSocket connection error:', errorMessage);
      setError(errorMessage);
      setIsConnecting(false);
      if (options.onError) options.onError(errorMessage);
    }
  }, [options]);

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
