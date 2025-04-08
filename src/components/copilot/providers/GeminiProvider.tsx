
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AIMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

// Define the GeminiContext type
export interface GeminiContextType {
  messages: AIMessage[];
  sendMessage: (message: any) => Promise<void>;
  isProcessing: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  clearMessages: () => void;
  reconnect: () => void;
}

// Create the context with default values
const GeminiContext = createContext<GeminiContextType>({
  messages: [],
  sendMessage: async () => {},
  isProcessing: false,
  isConnected: false,
  isConnecting: false,
  error: null,
  clearMessages: () => {},
  reconnect: () => {},
});

export const useGemini = () => useContext(GeminiContext);

interface GeminiProviderProps {
  children: ReactNode;
}

export function GeminiProvider({ children }: GeminiProviderProps) {
  // State management
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Initialize connection on mount
  useEffect(() => {
    const initializeConnection = () => {
      try {
        // Mock successful connection
        setIsConnecting(true);
        setTimeout(() => {
          setIsConnected(true);
          setIsConnecting(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
        toast({
          description: "Failed to connect to Gemini API. Please try again.",
          variant: "destructive"
        });
        setIsConnecting(false);
      }
    };
    
    initializeConnection();
    
    // Cleanup function
    return () => {
      // Close any active connections
    };
  }, [toast]);
  
  // Send message function
  const sendMessage = async (messageData: any) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Add the user message to the chat history
      if (messageData.text) {
        const userMessage: AIMessage = {
          role: 'user',
          content: messageData.text,
          timestamp: Date.now(),
          id: `user-${Date.now()}`
        };
        setMessages(prev => [...prev, userMessage]);
      }
      
      // Simulate API response after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the assistant's response
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: `This is a simulated response to: "${messageData.text}"`,
        timestamp: Date.now(),
        id: `assistant-${Date.now()}`
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to process message";
      setError(errorMsg);
      toast({
        description: `Error: ${errorMsg}`,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };
  
  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  // Reconnect function
  const reconnect = () => {
    setError(null);
    setIsConnecting(true);
    
    // Simulate reconnection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        description: "Connection restored",
        variant: "success"
      });
    }, 1000);
  };
  
  const contextValue: GeminiContextType = {
    messages,
    sendMessage,
    isProcessing,
    isConnected,
    isConnecting,
    error,
    clearMessages,
    reconnect
  };

  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
}
