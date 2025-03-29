
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useGemini } from './GeminiProvider'; // Use the main provider context

// Define the context type
interface GeminiCopilotContextType {
  // Messages needs to come from GeminiProvider eventually
  messages: Array<{
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp?: number; // Make timestamp optional for now
  }>;
  sendMessage: (content: string) => void; // Will use context sendMessage
  isLoading: boolean; // Should be derived from context isConnecting
  // Voice-related state remains local for now
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void;
  clearMessages?: () => void; // This needs to be handled by GeminiProvider too
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
  // Use the main GeminiProvider context hook
  const {
    isConnected, 
    isConnecting, 
    error: connectionError, 
    sendMessage: contextSendMessage, 
    // Need message receiving and clearing from GeminiProvider
  } = useGemini();

  // TODO: Get messages from GeminiProvider context once available
  const [messages, setMessages] = useState<GeminiCopilotContextType['messages']>([]);
  
  // Simple voice state implementation (remains local)
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Toggle voice input (remains local)
  const toggleListening = useCallback(() => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTimeout(() => { setTranscript('Simulated voice transcript...'); setIsListening(false); }, 2000);
    } else {
      setTranscript('');
    }
  }, [isListening]);

  // Generate and play audio (mock implementation, remains local)
  const generateAndPlayAudio = useCallback((text: string) => {
    console.log('[GeminiCopilotProvider] Mock Playing audio for:', text);
  }, []);

  // Wrapper for sendMessage using context
  const sendMessage = useCallback(async (content: string) => {
    if (content.trim()) {
      // Optimistically add user message (consider moving to GeminiProvider)
      setMessages(prev => [...prev, { role: 'user', content, timestamp: Date.now() }]);
      try {
        // Assume contextSendMessage handles text only for now
        await contextSendMessage(content); 
        // TODO: Need response handling from context
      } catch (err) {
         console.error("Error sending via context: ", err);
         // TODO: Remove optimistic message or show error state
      }
      if (transcript) setTranscript('');
    }
  }, [contextSendMessage, transcript]);

  // TODO: Implement clearMessages via context
  const clearMessages = useCallback(() => {
     console.warn("clearMessages called but not implemented in GeminiProvider yet.")
     setMessages([]); // Local clear for now
  }, []);


  const value: GeminiCopilotContextType = {
    messages, // Use local messages for now
    sendMessage,
    isLoading: isConnecting, // Use context connecting state for loading
    isListening,
    transcript,
    toggleListening,
    generateAndPlayAudio,
    clearMessages 
  };

  return (
    <GeminiCopilotContext.Provider value={value}>
      {children}
    </GeminiCopilotContext.Provider>
  );
}
