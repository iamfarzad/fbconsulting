
import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { AIMessage, ChatContextType } from '@/types/chat';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { useToast } from '@/hooks/use-toast';

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_SHOW_MESSAGES'; payload: boolean }
  | { type: 'TOGGLE_FULLSCREEN' };

interface ChatState {
  messages: AIMessage[];
  inputValue: string;
  isLoading: boolean;
  showMessages: boolean;
  isInitialized: boolean;
  isFullScreen: boolean;
}

const initialState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  showMessages: false,
  isInitialized: false,
  isFullScreen: false
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.payload
      };
    case 'SET_SHOW_MESSAGES':
      return {
        ...state,
        showMessages: action.payload
      };
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullScreen: !state.isFullScreen
      };
    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children,
  apiKey,
  modelName
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { sendMessage: geminiSendMessage, isConnected } = useGemini();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initialized state based on Gemini connection
  React.useEffect(() => {
    dispatch({ 
      type: 'SET_SHOW_MESSAGES', 
      payload: isConnected 
    });
  }, [isConnected]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        role: 'user',
        content,
        timestamp: Date.now()
      }
    });
    
    // Clear input value
    dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
    
    // Set loading state
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Send message to Gemini
      await geminiSendMessage(content);
      
      // Message is received through the WebSocket connection
      // and added to state by the onmessage handler
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'error',
          content: error instanceof Error ? error.message : 'Error sending message',
          timestamp: Date.now()
        }
      });
      
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Always show messages when a message is sent
      dispatch({ type: 'SET_SHOW_MESSAGES', payload: true });
    }
  }, [geminiSendMessage, toast]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const toggleFullScreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  }, []);

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
