
import { useState, useCallback, useEffect, useRef } from 'react';
import { WebSocketClient, generateClientId, createWebSocketUrl } from '@/utils/websocketUtils';
import { useToast } from '@/hooks/use-toast';
import { AIMessage, MessageRole } from '@/types/chat';

interface UseGeminiChatOptions {
  autoConnect?: boolean;
  enableTTS?: boolean;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: string) => void;
}

export function useGeminiChat(options: UseGeminiChatOptions = {}) {
  const {
    autoConnect = true,
    enableTTS = true,
    onConnected,
    onDisconnected,
    onError
  } = options;

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState(generateClientId());
  
  const wsClientRef = useRef<WebSocketClient | null>(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  const connect = useCallback(() => {
    if (wsClientRef.current?.isConnected()) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    const wsUrl = createWebSocketUrl(clientId);
    const wsClient = new WebSocketClient(wsUrl, {
      onOpen: () => {
        setIsConnected(true);
        setIsConnecting(false);
        if (onConnected) onConnected();
      },
      onClose: () => {
        setIsConnected(false);
        if (onDisconnected) onDisconnected();
      },
      onMessage: (data) => {
        handleWebSocketMessage(data);
      },
      onError: (errorMessage) => {
        setError(errorMessage);
        setIsConnecting(false);
        if (onError) onError(errorMessage);
        
        // Only show toast for critical errors
        if (!errorMessage.includes('WebSocket closed')) {
          toast({
            title: 'Connection Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      },
      autoReconnect: true
    });

    wsClient.connect();
    wsClientRef.current = wsClient;
  }, [clientId, toast, onConnected, onDisconnected, onError]);

  const disconnect = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
      wsClientRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const handleWebSocketMessage = useCallback((data: any) => {
    if (data.type === 'text' && data.content) {
      addMessage('assistant', data.content);
    } else if (data.type === 'error' && data.error) {
      setError(data.error);
      addMessage('error', data.error);
    } else if (data.type === 'complete') {
      setIsLoading(false);
    }
  }, []);

  const addMessage = useCallback((role: MessageRole, content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role,
        content,
        timestamp: Date.now(),
        id: `${role}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      }
    ]);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    // Check connection
    if (!wsClientRef.current || !isConnected) {
      connect();
      toast({
        title: 'Connecting...',
        description: 'Establishing connection to AI service',
      });
      return;
    }

    // Add user message
    addMessage('user', content);
    setInputValue('');
    setIsLoading(true);

    // Send to WebSocket
    const message = {
      text: content,
      role: 'user',
      enableTTS
    };

    const success = wsClientRef.current.send(message);
    if (!success) {
      setError('Failed to send message');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  }, [connect, addMessage, isConnected, enableTTS, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    // State
    messages,
    inputValue,
    isLoading,
    isConnected,
    isConnecting,
    error,
    
    // Actions
    setInputValue,
    sendMessage,
    clearMessages,
    connect,
    disconnect,
  };
}

export default useGeminiChat;
