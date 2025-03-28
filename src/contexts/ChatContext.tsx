
import React, { createContext, useContext, useRef, useState } from 'react';
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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
    enableTTS: true,
    apiKey,
    modelName
  });

  // Set up the combined state object
  const state = {
    messages,
    inputValue,
    isLoading,
    showMessages: isConnected,
    isInitialized: isConnected,
    isFullScreen
  };

  // Set up the dispatch function
  const dispatch = (action: any) => {
    switch (action.type) {
      case 'SET_INPUT_VALUE':
        setInputValue(action.payload);
        break;
      case 'TOGGLE_FULLSCREEN':
        setIsFullScreen(prev => !prev);
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const value = {
    state,
    dispatch,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    containerRef,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
