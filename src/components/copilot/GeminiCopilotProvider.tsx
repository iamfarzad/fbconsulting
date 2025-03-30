import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useGemini } from './providers/GeminiProvider';
import { Message } from '../../types/message';

// Define the context type
interface GeminiCopilotContextType {
  messages: Message[];
  sendMessage: (content: string) => void;
  isLoading: boolean;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void;
  clearMessages: () => void;
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
  // Use Gemini Provider
  const {
    messages,
    sendMessage: geminiSendMessage,
    isProcessing: isLoading,
    clearMessages,
    startRecording,
    stopRecording,
    isRecording,
    stopAudio
  } = useGemini();

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Toggle voice input
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecording();
      setTranscript('');
    } else {
      startRecording();
    }
    setIsListening(prev => !prev);
  }, [isListening, startRecording, stopRecording]);

  // Generate and play audio using the consolidated audio functionality
  const generateAndPlayAudio = useCallback((text: string) => {
    geminiSendMessage({
      type: 'text_message',
      text,
      enableTTS: true
    });
  }, [geminiSendMessage]);

  // Wrapper for sendMessage to handle voice input
  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      geminiSendMessage({
        type: 'text_message',
        text: content,
        enableTTS: true
      });
      // Clear transcript if it was set
      if (transcript) {
        setTranscript('');
      }
    }
  }, [geminiSendMessage, transcript]);

  const value: GeminiCopilotContextType = {
    messages,
    sendMessage,
    isLoading,
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
