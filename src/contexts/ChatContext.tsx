
import React, { createContext, useContext, useReducer, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AIMessage, MessageRole } from '@/features/gemini/types';

// Define the shape of our chat state
interface ChatState {
  messages: AIMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  isFullScreen: boolean;
  showMessages: boolean;
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
  | { type: 'SET_INITIALIZED'; payload: boolean };

// Initial state
const initialChatState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  error: null,
  isFullScreen: false,
  showMessages: true,
  isInitialized: false,
};

// Reducer function to handle state updates
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
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
    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };
    default:
      return state;
  }
}

// Create a type for the ChatContext
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{ 
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}> = ({ 
  children,
  apiKey,
  modelName = 'gemini-2.0-flash'
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with API key if provided
  React.useEffect(() => {
    if (apiKey) {
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } else {
      // Try to get API key from environment
      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (envApiKey) {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    }
  }, [apiKey]);

  // Send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

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
      
      // Call Gemini API to get a response
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: content,
          apiKey: apiKey || import.meta.env.VITE_GEMINI_API_KEY || '',
          model: modelName
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to state
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: data.text || 'Sorry, I could not generate a response.',
        timestamp: Date.now(),
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
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
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  // Provide the context value
  const value = {
    state,
    dispatch,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    containerRef,
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
