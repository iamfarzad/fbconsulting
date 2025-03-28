
import React, { createContext, useContext, useRef, useState, useReducer } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { useToast } from '@/hooks/use-toast';

export interface ChatState {
  messages: AIMessage[];
  inputValue: string;
  isLoading: boolean;
  showMessages: boolean;
  isInitialized: boolean;
  isFullScreen: boolean;
}

export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<any>;
  sendMessage: (text: string, files?: any[]) => void;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  error: string | null;
}

interface ChatProviderProps {
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}

const initialState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  showMessages: false,
  isInitialized: false,
  isFullScreen: false
};

function chatReducer(state: ChatState, action: any) {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullScreen: !state.isFullScreen };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SHOW_MESSAGES':
      return { ...state, showMessages: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();
  
  const {
    messages,
    inputValue,
    isLoading,
    isConnected,
    error,
    setInputValue,
    sendMessage: geminiSendMessage,
    clearMessages: geminiClearMessages,
    connect
  } = useGeminiChat({
    autoConnect: true,
    enableTTS: true,
    apiKey,
    modelName
  });

  // Update state when messages change
  React.useEffect(() => {
    dispatch({ type: 'SET_MESSAGES', payload: messages });
  }, [messages]);

  // Update state when loading changes
  React.useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [isLoading]);

  // Update state when connection status changes
  React.useEffect(() => {
    dispatch({ type: 'SET_INITIALIZED', payload: isConnected });
    dispatch({ type: 'SET_SHOW_MESSAGES', payload: isConnected });
  }, [isConnected]);

  // Send a message
  const sendMessage = (text: string, files: any[] = []) => {
    if (!text.trim() && (!files || files.length === 0)) {
      toast({
        title: "Message is empty",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    geminiSendMessage(text);
    dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
    dispatch({ type: 'SET_SHOW_MESSAGES', payload: true });
  };

  // Clear messages
  const clearMessages = () => {
    geminiClearMessages();
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
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
