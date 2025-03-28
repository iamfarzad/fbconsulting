
import React, { createContext, useContext, useReducer, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AIMessage, MessageRole } from '@/features/gemini/types';
import { GeminiAdapter } from '@/features/gemini/services/geminiAdapter';

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
const initialChatState: ChatState = {
  messages: [],
  inputValue: '',
  isLoading: false,
  error: null,
  isFullScreen: false,
  showMessages: true,
  suggestedResponse: null,
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
  modelName = 'gemini-1.0-pro'
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with API key if provided
  React.useEffect(() => {
    if (apiKey) {
      GeminiAdapter.initialize(apiKey);
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    } else {
      // Try to get API key from environment
      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (envApiKey) {
        GeminiAdapter.initialize(envApiKey);
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } else {
        console.warn("No API key provided for Gemini. Using mock responses.");
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      }
    }
  }, [apiKey]);

  // Clear messages function
  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
    dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
  };

  // Toggle fullscreen function
  const toggleFullScreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  // Send message function
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Set loading state
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Add user message
      const userMessage: AIMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      
      // Clear input
      dispatch({ type: 'SET_INPUT_VALUE', payload: '' });

      // Generate AI response
      const response = await GeminiAdapter.generateResponse({
        prompt: content.trim(),
        model: modelName
      });

      if (response.error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: response.error 
        });

        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      }

      // Add AI response
      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response.text,
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        sendMessage,
        clearMessages,
        toggleFullScreen,
        containerRef
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Create a hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
