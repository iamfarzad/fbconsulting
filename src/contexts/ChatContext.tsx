
import React, { createContext, useContext, useRef } from 'react';
import { AIMessage, ChatContextType } from '@/types/chat';
import { useGeminiChat } from '@/hooks/useGeminiChat';

interface ChatProviderProps {
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children,
  apiKey,
  modelName
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    inputValue,
    isLoading,
    isConnected,
    error,
    setInputValue,
    sendMessage,
    clearMessages,
    connect
  } = useGeminiChat({
    autoConnect: true,
    enableTTS: true
  });

  // Set up the combined state object
  const state = {
    messages,
    inputValue,
    isLoading,
    showMessages: isConnected,
    isInitialized: isConnected,
    isFullScreen: false
  };

  // Set up the dispatch function (simplified for our context)
  const dispatch = (action: any) => {
    switch (action.type) {
      case 'SET_INPUT_VALUE':
        setInputValue(action.payload);
        break;
      case 'TOGGLE_FULLSCREEN':
        // This will be handled separately
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  const toggleFullScreen = () => {
    // We'll handle this with a separate state later
  };

  const value = {
    state,
    dispatch,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    containerRef
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
