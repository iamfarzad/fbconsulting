
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useWebSocketChat } from '@/features/gemini/hooks/useWebSocketChat';

// Define the context type
interface GeminiCopilotContextType {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
  }>;
  sendMessage: (content: string) => void;
  isLoading: boolean;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void;
}

// Create the context
const GeminiCopilotContext = createContext<GeminiCopilotContextType | null>(null);

// Hook to use the context
export const useGeminiCopilot = () => {
  const context = useContext(GeminiCopilotContext);
  if (!context) {
    throw new Error('useGeminiCopilot must be used within a GeminiCopilotProvider');
  }
  return context;
};

interface GeminiCopilotProviderProps {
  children: ReactNode;
}

export function GeminiCopilotProvider({ children }: GeminiCopilotProviderProps) {
  // Use the WebSocket Chat hook
  const {
    messages,
    isLoading,
    sendMessage: wssSendMessage,
    clearMessages
  } = useWebSocketChat();

  // Simple voice state implementation (without actual functionality)
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Toggle voice input
  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    // In a real implementation, we would start/stop the speech recognition here
    if (!isListening) {
      // Mock transcript after a delay
      setTimeout(() => {
        setTranscript('This is a simulated voice transcript');
        setIsListening(false);
      }, 2000);
    } else {
      setTranscript('');
    }
  }, [isListening]);

  // Generate and play audio (mock implementation)
  const generateAndPlayAudio = useCallback((text: string) => {
    console.log('Playing audio for:', text);
    // In a real implementation, we would generate and play audio here
  }, []);

  // Wrapper for sendMessage for simplicity
  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      wssSendMessage(content);
      // Clear transcript if it was set
      if (transcript) {
        setTranscript('');
      }
    }
  }, [wssSendMessage, transcript]);

  const value = {
    messages,
    sendMessage,
    isLoading,
    isListening,
    transcript,
    toggleListening,
    generateAndPlayAudio
  };

  return (
    <GeminiCopilotContext.Provider value={value}>
      {children}
    </GeminiCopilotContext.Provider>
  );
}
