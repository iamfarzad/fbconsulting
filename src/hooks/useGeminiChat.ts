
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AIMessage } from '@/services/chat/messageTypes';
import { API_CONFIG } from '@/config/apiConfig';

interface UseGeminiChatProps {
  apiKey?: string;
  modelName?: string;
  autoConnect?: boolean;
  enableTTS?: boolean;
}

export function useGeminiChat({
  apiKey,
  modelName,
  autoConnect = true,
  enableTTS = true
}: UseGeminiChatProps = {}) {
  // State
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Connect to the API service
  const connect = useCallback(async () => {
    try {
      // Check if API key is available
      const effectiveApiKey = apiKey || API_CONFIG.GEMINI_API_KEY;
      
      if (!effectiveApiKey) {
        setError('No API key provided');
        return false;
      }
      
      // Simulate API connection - in a real app this would check the API
      setIsConnected(true);
      setError(null);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to API';
      setError(errorMessage);
      setIsConnected(false);
      
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      return false;
    }
  }, [apiKey, toast]);
  
  // Disconnect from the API service
  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);
  
  // Add a message to the chat
  const addMessage = useCallback((role: 'user' | 'assistant' | 'system' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);
  
  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    addMessage('user', text);
    
    // Clear input
    setInputValue('');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // In a real app, this would call the API
      setTimeout(() => {
        // Simulate a response
        addMessage('assistant', `You said: "${text}". This is a placeholder response since we're not connected to the real API.`);
        
        // Set loading state
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      // Add error message
      addMessage('error', errorMessage);
      
      // Set error state
      setError(errorMessage);
      
      // Show toast
      toast({
        title: 'Message Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      // Set loading state
      setIsLoading(false);
    }
  }, [addMessage, toast]);
  
  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);
  
  return {
    messages,
    inputValue,
    isLoading,
    isConnected,
    error,
    setInputValue,
    sendMessage,
    clearMessages,
    connect,
    disconnect
  };
}
