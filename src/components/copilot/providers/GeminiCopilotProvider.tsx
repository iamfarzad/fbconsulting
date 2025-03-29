
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useGemini } from './GeminiProvider'; // Use the main provider context

// Define the context type
interface GeminiCopilotContextType {
  messages: Array<{
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
    timestamp?: number;
    id?: string; // Add ID if needed for React keys
  }>;
  sendMessage: (content: string, files?: Array<{mime_type: string, data: string, filename?: string}>) => void; // Allow optional files
  isLoading: boolean; // Derived from context
  isListening: boolean; // Local state
  transcript: string; // Local state
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void; // Mock
  clearMessages?: () => void; // From context
  connectionError: string | null; // From context
  isConnected: boolean; // From context
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
    messages: contextMessages, // Get messages from the provider
    isProcessing: contextIsProcessing,
    clearMessages: contextClearMessages,
    reconnect // Add reconnect if needed
  } = useGemini();

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
    // TODO: Integrate actual TTS from GeminiProvider if needed
  }, []);

  // Wrapper for sendMessage using context
  const sendMessage = useCallback(async (content: string, files?: Array<{mime_type: string, data: string, filename?: string}>) => {
    if (!isConnected) {
      console.error("[GeminiCopilotProvider] Not connected, attempting reconnect.");
      reconnect();
      // Consider throwing error or showing toast
      return;
    }
    if (content.trim() || (files && files.length > 0)) {
      let messageToSend: any;
      if (files && files.length > 0) {
          messageToSend = { type: 'multimodal_message', text: content || null, files };
      } else {
          messageToSend = { type: 'text_message', text: content };
      }
      
      try {
        console.log("[GeminiCopilotProvider] Sending via context:", messageToSend);
        await contextSendMessage(messageToSend); // Send structured message
      } catch (err) {
         console.error("[GeminiCopilotProvider] Error sending via context: ", err);
         // Handle error display if needed
      }
      if (transcript) setTranscript('');
    }
  }, [isConnected, contextSendMessage, transcript, reconnect]);


  const value: GeminiCopilotContextType = {
    messages: contextMessages, // Use messages from parent context
    sendMessage,
    isLoading: contextIsProcessing || isConnecting, // Combine loading states
    isListening,
    transcript,
    toggleListening,
    generateAndPlayAudio,
    clearMessages: contextClearMessages, // Use parent clear function
    connectionError,
    isConnected
  };

  return (
    <GeminiCopilotContext.Provider value={value}>
      {children}
    </GeminiCopilotContext.Provider>
  );
}
