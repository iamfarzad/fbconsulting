
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocketChat } from '@/features/gemini/hooks/useWebSocketChat';
import { AIMessage } from '@/features/gemini/types/messageTypes';

interface ChatContextType {
  state: {
    messages: AIMessage[];
    isLoading: boolean;
    isConnected: boolean;
    isInitialized: boolean;
    isAudioPlaying: boolean;
    audioProgress: number;
  };
  actions: {
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    connect: () => void;
    disconnect: () => void;
    stopAudio: () => void;
  };
  error: string | null;
  clientId: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    messages,
    isLoading,
    isConnected,
    isConnecting,
    isAudioPlaying,
    audioProgress,
    error,
    clientId,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    stopAudio
  } = useWebSocketChat();

  // Set initialized after connection attempt
  useEffect(() => {
    if (isConnected || (!isConnecting && error)) {
      setIsInitialized(true);
    }
  }, [isConnected, isConnecting, error]);

  const state = {
    messages,
    isLoading,
    isConnected,
    isInitialized,
    isAudioPlaying,
    audioProgress
  };

  const actions = {
    sendMessage,
    clearMessages,
    connect,
    disconnect,
    stopAudio
  };

  return (
    <ChatContext.Provider value={{ state, actions, error, clientId }}>
      {children}
    </ChatContext.Provider>
  );
};
