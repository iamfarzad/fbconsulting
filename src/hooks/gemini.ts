
// src/hooks/gemini.ts
import { useState, useCallback } from 'react';

// Basic types for the Gemini hooks
interface GeminiState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: any[];
}

export const useGemini = () => {
  const [state, setState] = useState<GeminiState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    messages: []
  });

  // Simulated send message function
  const sendMessage = useCallback(async (content: string) => {
    try {
      // Set state to loading/connecting
      setState(prev => ({ ...prev, isConnecting: true }));
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add user message to state
      const userMessage = {
        role: 'user',
        content,
        timestamp: Date.now()
      };
      
      // Add the message to state
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        messages: [...prev.messages, userMessage]
      }));
      
      // Simulate AI response after a delay
      setTimeout(() => {
        const assistantMessage = {
          role: 'assistant',
          content: `This is a response to: ${content}`,
          timestamp: Date.now()
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }));
      }, 1000);
      
      return { text: "Message sent successfully" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setState(prev => ({ ...prev, isConnecting: false, error: errorMessage }));
      return { text: "Error sending message", error: errorMessage };
    }
  }, []);

  return {
    ...state,
    sendMessage
  };
};

// This is just a stub for the initialization hook
export const useGeminiInitialization = () => {
  return {
    isInitialized: true,
    error: null,
    initialized: true
  };
};

// Simplified service hook that satisfies the interface expected by components
export const useGeminiService = ({ onError }: { onError?: (error: string) => void } = {}) => {
  const { sendMessage, error, isConnecting, messages } = useGemini();
  
  // Pass errors to the callback if provided
  if (error && onError) {
    onError(error);
  }
  
  return {
    sendMessage,
    messages,
    isLoading: isConnecting
  };
};
