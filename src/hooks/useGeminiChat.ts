
import { useState, useCallback, useEffect } from 'react';
import { AIMessage } from '@/types/chat';

interface UseGeminiChatProps {
  autoConnect?: boolean;
  enableTTS?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function useGeminiChat({
  autoConnect = false,
  enableTTS = false,
  apiKey,
  modelName
}: UseGeminiChatProps = {}) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Setup connection on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
  }, [autoConnect]);

  // Connect to the Gemini service
  const connect = useCallback(async () => {
    try {
      setIsConnected(false);
      // In a real implementation, this would connect to your Gemini service
      console.log('Connecting to Gemini with API key:', apiKey ? 'API key exists' : 'No API key');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setError(null);
      
      // Add a system message
      if (messages.length === 0) {
        setMessages([{
          role: 'system',
          content: 'Hello! I am your AI assistant. How can I help you today?',
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Error connecting to Gemini:', error);
      setError('Failed to connect to Gemini service');
      setIsConnected(false);
    }
  }, [apiKey, messages.length]);

  // Send a message to the Gemini service
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Add user message to history
      const userMessage: AIMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      setInputValue('');
      
      // In a real implementation, this would call your Gemini service
      console.log('Sending message to Gemini:', content);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simple mock response
      const response = mockGeminiResponse(content);
      
      // Add assistant message to history
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      
      // Add error message to history
      const errorMessage: AIMessage = {
        role: 'error',
        content: error instanceof Error ? error.message : 'An error occurred while processing your request',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Generate a mock response for testing
  const mockGeminiResponse = (prompt: string): string => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('hello') || promptLower.includes('hi')) {
      return "Hello! How can I help you today?";
    }
    
    if (promptLower.includes('help') || promptLower.includes('?')) {
      return "I'd be happy to help! I can answer questions about our AI services, assist with brainstorming, or provide information on how to get started with AI integration.";
    }
    
    if (promptLower.includes('feature') || promptLower.includes('service')) {
      return "Our AI services include natural language processing, image recognition, and automated workflow solutions. These features can help streamline your operations and enhance user experiences.";
    }
    
    return "Thank you for your message. I'm your AI assistant here to help with information about our services. Would you like to learn more about a specific topic?";
  };

  return {
    messages,
    inputValue,
    isLoading,
    isConnected,
    error,
    setInputValue,
    sendMessage,
    clearMessages,
    connect
  };
}
