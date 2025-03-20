
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { AIMessage, ChatService, FileAttachment } from '@/services/chat/types';
import { getChatService } from '@/services/chat/googleGenAIService';
import { toast } from '@/components/ui/use-toast';

// Define the shape of our chat state
interface ChatState {
  messages: AIMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  isFullScreen: boolean;
  showMessages: boolean;
  suggestedResponse: string | null;
  isInitialized: boolean;
}

// Define the actions we can dispatch
type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'SET_MESSAGES'; payload: AIMessage[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_SHOW_MESSAGES'; payload: boolean }
  | { type: 'SET_SUGGESTED_RESPONSE'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean };

// Initial state
const initialState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  error: null,
  isFullScreen: false,
  showMessages: true,
  suggestedResponse: null,
  isInitialized: false,
};

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        showMessages: true,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      };
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullScreen: !state.isFullScreen,
      };
    case 'SET_FULLSCREEN':
      return {
        ...state,
        isFullScreen: action.payload,
      };
    case 'SET_SHOW_MESSAGES':
      return {
        ...state,
        showMessages: action.payload,
      };
    case 'SET_SUGGESTED_RESPONSE':
      return {
        ...state,
        suggestedResponse: action.payload,
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };
    default:
      return state;
  }
}

// Create the context
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string, files?: FileAttachment[]) => Promise<void>;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isInitialized: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}> = ({ children, apiKey: propApiKey, modelName: propModelName }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService | null>(null);

  // Get the API key and initialize the chat service
  useEffect(() => {
    const initChatService = async () => {
      try {
        // Prioritize prop API key, then env API key
        const apiKey = propApiKey || import.meta.env.VITE_GEMINI_API_KEY;
        const modelName = propModelName || 'gemini-pro';
        
        if (apiKey) {
          chatServiceRef.current = getChatService({ 
            apiKey, 
            modelName,
            temperature: 0.7,
            maxTokens: 1024 
          });
          dispatch({ type: 'SET_INITIALIZED', payload: true });
          console.log('Chat service initialized successfully');
        } else {
          console.warn('No API key found for chat service');
          dispatch({ type: 'SET_ERROR', payload: 'No API key provided' });
        }
      } catch (error) {
        console.error('Failed to initialize chat service:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize chat service' });
      }
    };

    initChatService();
  }, [propApiKey, propModelName]);

  // Send a message
  const sendMessage = async (content: string, files?: FileAttachment[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add user message to state
      const userMessage: AIMessage = {
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
      
      // Get response from chat service
      if (chatServiceRef.current) {
        const response = await chatServiceRef.current.sendMessage(
          content,
          state.messages,
          files
        );
        
        dispatch({ type: 'ADD_MESSAGE', payload: response });
      } else {
        // Mock response if service isn't available
        setTimeout(() => {
          const mockResponse: AIMessage = {
            role: 'assistant',
            content: `This is a mock response to: ${content}`,
            timestamp: Date.now(),
          };
          dispatch({ type: 'ADD_MESSAGE', payload: mockResponse });
        }, 1000);

        // Show toast about missing API key
        toast({
          title: 'Using Demo Mode',
          description: 'Set up Gemini API Key for full AI functionality.',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: errorMessage 
      });
      
      // Also add an error message to the chat
      const errorResponse: AIMessage = {
        role: 'error',
        content: `Error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorResponse });
      
      toast({
        title: 'Error sending message',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear all messages
  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    if (chatServiceRef.current) {
      chatServiceRef.current.clearHistory();
    }
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
    isInitialized: state.isInitialized,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook for consuming the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
