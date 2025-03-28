
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocketChat } from '@/features/gemini/hooks/useWebSocketChat';
import { AIMessage } from '@/features/gemini/types/messageTypes';

// Define the Chat Context type
export interface ChatContextType {
  state: {
    messages: AIMessage[];
    isLoading: boolean;
    isConnected: boolean;
    isInitialized: boolean;
    isAudioPlaying: boolean;
    audioProgress: number;
    clientId: string;
  };
  actions: {
    sendMessage: (content: string) => void;
    clearMessages: () => void;
    connect: () => void;
    disconnect: () => void;
    stopAudio: () => void;
  };
  error: string | null;
  clientId: string;
}

// Create the Chat Context
const ChatContext = createContext<ChatContextType | null>(null);

// Hook to use the Chat Context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Chat Provider Component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Use the WebSocket Chat hook
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

  // Set initialized after first connection attempt
  useEffect(() => {
    if (isConnected || (!isConnecting && clientId)) {
      setIsInitialized(true);
    }
  }, [isConnected, isConnecting, clientId]);

  // Combine state and actions into a single context value
  const contextValue: ChatContextType = {
    state: {
      messages,
      isLoading,
      isConnected,
      isInitialized,
      isAudioPlaying,
      audioProgress,
      clientId
    },
    actions: {
      sendMessage,
      clearMessages,
      connect,
      disconnect,
      stopAudio
    },
    error,
    clientId
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
