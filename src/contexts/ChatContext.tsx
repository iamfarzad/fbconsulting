
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useWebSocketChat } from '@/features/gemini/hooks/useWebSocketChat';
import { AIMessage } from '@/services/chat/messageTypes';

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
    inputValue: string;
    showMessages: boolean;
  };
  actions: {
    sendMessage: (content: string) => void;
    clearMessages: () => void;
    connect: () => void;
    disconnect: () => void;
    stopAudio: () => void;
    setInputValue: (value: string) => void;
    setShowMessages: (show: boolean) => void;
  };
  error: string | null;
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
export const ChatProvider: React.FC<{ 
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}> = ({ 
  children,
  apiKey,
  modelName
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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
    sendMessage: wssSendMessage,
    clearMessages,
    stopAudio
  } = useWebSocketChat();

  // Set initialized after first connection attempt
  useEffect(() => {
    if (isConnected || (!isConnecting && clientId)) {
      setIsInitialized(true);
    }
  }, [isConnected, isConnecting, clientId]);

  // Show messages when they exist
  useEffect(() => {
    if (messages.length > 0 && !showMessages) {
      setShowMessages(true);
    }
  }, [messages.length, showMessages]);

  // Wrapper for sendMessage that also clears input
  const sendMessage = (content: string) => {
    if (content.trim()) {
      wssSendMessage(content);
      setInputValue('');
    }
  };

  // Ensure all messages have the required timestamp property
  const messagesWithTimestamps: AIMessage[] = messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp || Date.now(),
  }));

  // Combine state and actions into a single context value
  const contextValue: ChatContextType = {
    state: {
      messages: messagesWithTimestamps,
      isLoading,
      isConnected,
      isInitialized,
      isAudioPlaying,
      audioProgress,
      clientId,
      inputValue,
      showMessages
    },
    actions: {
      sendMessage,
      clearMessages,
      connect,
      disconnect,
      stopAudio,
      setInputValue,
      setShowMessages
    },
    error
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
