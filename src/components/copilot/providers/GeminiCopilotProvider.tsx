import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GeminiConfig, DEFAULT_CONFIG } from '@/types/gemini';
import { ChatMessage } from '@/types/copilot';
import { useGeminiService } from '@/hooks/useGeminiService';

interface GeminiCopilotContextProps {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isLoading: boolean;
  transcript: string;
  isListening: boolean;
  toggleListening: () => void;
  generateAndPlayAudio: (text: string) => void;
}

const GeminiCopilotContext = createContext<GeminiCopilotContextProps | undefined>(undefined);

export const useGeminiCopilot = (): GeminiCopilotContextProps => {
  const context = useContext(GeminiCopilotContext);
  if (!context) {
    throw new Error('useGeminiCopilot must be used within a GeminiCopilotProvider');
  }
  return context;
};

interface GeminiCopilotProviderProps {
  children: ReactNode;
  config?: GeminiConfig;
}

export const GeminiCopilotProvider = ({ children, config = DEFAULT_CONFIG }: GeminiCopilotProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const { sendMessage, isLoading, generateAndPlayAudio } = useGeminiService();

  const handleSendMessage = (message: string) => {
    sendMessage(message);
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
  };

  const toggleListening = () => {
    setIsListening((prevIsListening) => !prevIsListening);
  };

  useEffect(() => {
    if (transcript && !isListening) {
      handleSendMessage(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      generateAndPlayAudio(lastMessage.content);
    }
  }, [messages, generateAndPlayAudio]);

  return (
    <GeminiCopilotContext.Provider
      value={{
        messages,
        sendMessage: handleSendMessage,
        isLoading,
        transcript,
        isListening,
        toggleListening,
        generateAndPlayAudio,
      }}
    >
      {children}
    </GeminiCopilotContext.Provider>
  );
};
