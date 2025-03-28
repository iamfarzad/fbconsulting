
import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketClient } from '../services/WebSocketClient';
import { WebSocketClientOptions, WebSocketMessage } from '../types/websocketTypes';
import { useToast } from '@/hooks/use-toast';

export function useWebSocketClient(options?: WebSocketClientOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const wsClientRef = useRef<WebSocketClient | null>(null);
  const { toast } = useToast();

  const initClient = useCallback(() => {
    const clientOptions: WebSocketClientOptions = {
      ...options,
      onOpen: () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        if (options?.onOpen) options.onOpen();
      },
      onClose: () => {
        setIsConnected(false);
        if (options?.onClose) options.onClose();
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setIsConnected(false);
        setIsConnecting(false);
        if (options?.onError) options.onError(errorMsg);
      },
      onMessage: (message: WebSocketMessage) => {
        // Handle standard messages
        if (message.type === 'error' && message.error) {
          setError(message.error);
          toast({
            title: "Connection Error",
            description: message.error,
            variant: "destructive",
          });
        }
        
        // Pass to the original handler if provided
        if (options?.onMessage) options.onMessage(message);
      }
    };
    
    wsClientRef.current = new WebSocketClient(clientOptions);
    setClientId(wsClientRef.current.getClientId());
    return wsClientRef.current;
  }, [options, toast]);

  // Connect function
  const connect = useCallback(() => {
    setIsConnecting(true);
    if (!wsClientRef.current) {
      initClient();
    }
    wsClientRef.current?.connect();
  }, [initClient]);

  // Disconnect function
  const disconnect = useCallback(() => {
    wsClientRef.current?.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Send message function
  const sendMessage = useCallback((message: any): boolean => {
    if (!wsClientRef.current || !isConnected) {
      toast({
        title: "Not Connected",
        description: "Cannot send message, WebSocket is not connected",
        variant: "destructive",
      });
      return false;
    }
    
    return wsClientRef.current.send(message);
  }, [isConnected, toast]);

  // Send text message helper
  const sendTextMessage = useCallback((text: string, enableTTS: boolean = true) => {
    return sendMessage({
      type: 'text_message',
      text,
      enableTTS
    });
  }, [sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsClientRef.current?.disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    sendMessage,
    sendTextMessage,
    isConnected,
    isConnecting,
    error,
    clientId
  };
}
