
import React, { createContext, useContext, useState, useReducer, useCallback, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { 
  GeminiChatService, 
  getChatService,
  ChatMessage as GenAIChatMessage 
} from '@/services/chat/googleGenAIService';

// Define types for the chat context
interface ChatContextType {
  messages: AIMessage[];
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatService, setChatService] = useState<GeminiChatService | null>(null);
  
  // Initialize chat service
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      try {
        const service = getChatService({ apiKey });
        setChatService(service);
      } catch (error) {
        console.error('Error initializing chat service:', error);
        setError('Failed to initialize chat service');
      }
    } else {
      console.warn('No API key found for chat service');
    }
  }, []);
  
  // Function to send messages
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to state
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Get response from service if available
      if (chatService) {
        const response = await chatService.sendMessage(message, messages as GenAIChatMessage[]);
        setMessages(prev => [...prev, response]);
      } else {
        // Mock response if service is not available
        setTimeout(() => {
          const response: AIMessage = {
            role: 'assistant',
            content: `This is a mock response to: ${message}`,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, response]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [chatService, messages]);
  
  // Function to clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // The value that will be provided to consumers of this context
  const contextValue: ChatContextType = {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    error
  };
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for consuming the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
