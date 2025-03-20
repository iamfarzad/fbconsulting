
import React, { createContext, useContext, useState, useReducer, useEffect, useRef } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { useGeminiAPI } from '@/SafeApp';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { useToast } from '@/hooks/use-toast';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { GoogleGenAIChatService, getChatService } from '@/services/chat/googleGenAIService';

// Define the state interface
export interface ChatState {
  messages: AIMessage[];
  isLoading: boolean;
  isFullScreen: boolean;
  inputValue: string;
  suggestedResponse: string | null;
  showMessages: boolean;
  error: string | null;
}

// Define the action types
type ChatAction =
  | { type: 'SET_MESSAGES'; payload: AIMessage[] }
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_INPUT_VALUE'; payload: string }
  | { type: 'SET_SUGGESTED_RESPONSE'; payload: string | null }
  | { type: 'SET_SHOW_MESSAGES'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Create the initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isFullScreen: false,
  inputValue: '',
  suggestedResponse: null,
  showMessages: false,
  error: null,
};

// Create the reducer function
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FULLSCREEN':
      return { ...state, isFullScreen: action.payload };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullScreen: !state.isFullScreen };
    case 'SET_INPUT_VALUE':
      return { ...state, inputValue: action.payload };
    case 'SET_SUGGESTED_RESPONSE':
      return { ...state, suggestedResponse: action.payload };
    case 'SET_SHOW_MESSAGES':
      return { ...state, showMessages: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Interface for the context
interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string, files?: { mimeType: string; data: string; name: string; type: string }[]) => Promise<void>;
  clearMessages: () => void;
  toggleFullScreen: () => void;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  chatService: GoogleGenAIChatService | null;
  isInitialized: boolean;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper function to convert service messages to AIMessages
const convertToAIMessages = (messages: any[]): AIMessage[] => {
  return messages.map(msg => ({
    role: msg.role as AIMessage['role'],
    content: msg.content,
    timestamp: msg.timestamp || Date.now(),
    id: msg.id,
    metadata: msg.metadata
  }));
};

// Provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [chatService, setChatService] = useState<GoogleGenAIChatService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { apiKey } = useGeminiAPI();
  const { personaData } = usePersonaManagement();

  // Initialize chat service
  useEffect(() => {
    let isMounted = true;
    let initAttempt = 0;
    const maxAttempts = 3;
    
    const initializeChatService = async () => {
      try {
        initAttempt++;
        console.log(`Initialization attempt ${initAttempt}/${maxAttempts}`);

        if (!apiKey) {
          throw new Error('API key is missing');
        }

        const trimmedApiKey = apiKey.trim();
        if (!trimmedApiKey) {
          throw new Error('API key is empty after trimming');
        }

        // Create service configuration
        const serviceConfig = {
          apiKey: trimmedApiKey,
          modelName: 'gemini-pro',
          temperature: 0.9,
          maxOutputTokens: 2048,
          topP: 1.0,
          topK: 1
        };

        // Create service
        const service = await getChatService(serviceConfig);
        if (!service) {
          throw new Error('Failed to create chat service instance');
        }

        // Test connection
        const connectionTest = await service.testConnection();
        if (!connectionTest) {
          throw new Error('Connection test failed');
        }

        if (!isMounted) return;

        setChatService(service);
        setIsInitialized(true);

        // Initialize with persona if available
        if (personaData) {
          await service.initializeChat(personaData);
          const history = service.getHistory();
          dispatch({ type: 'SET_MESSAGES', payload: convertToAIMessages(history) });
        }

        console.log('Chat service initialization complete');
      } catch (error) {
        if (!isMounted) return;

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Chat service initialization failed:', errorMessage);

        if (initAttempt < maxAttempts) {
          setTimeout(() => {
            if (isMounted) {
              initializeChatService();
            }
          }, 1000);
          return;
        }

        toast({
          title: 'Chat Service Error',
          description: `Could not initialize: ${errorMessage}`,
          variant: 'destructive'
        });
        
        setIsInitialized(false);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    };

    initializeChatService();

    return () => {
      isMounted = false;
    };
  }, [apiKey, personaData, toast]);

  // Update messages when persona changes
  useEffect(() => {
    const updateMessages = async () => {
      try {
        if (chatService && personaData && isInitialized) {
          await chatService.initializeChat(personaData);
          const history = chatService.getHistory();
          dispatch({ type: 'SET_MESSAGES', payload: convertToAIMessages(history) });
        }
      } catch (error) {
        console.error('Error updating messages with persona change:', error);
      }
    };
    updateMessages();
  }, [personaData, chatService, isInitialized]);

  // Show messages container when first message is sent
  useEffect(() => {
    if (state.messages.length > 0 && !state.showMessages) {
      dispatch({ type: 'SET_SHOW_MESSAGES', payload: true });
    }
  }, [state.messages.length, state.showMessages]);

  // Auto-resize container based on content
  useEffect(() => {
    const calculateContainerHeight = () => {
      if (containerRef.current && typeof window !== 'undefined') {
        const vh = window.innerHeight;
        const maxHeight = Math.min(vh * 0.7, 600);
        containerRef.current.style.maxHeight = `${maxHeight}px`;
      }
    };

    calculateContainerHeight();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, []);

  // Utility functions
  const addUserMessage = (content: string) => {
    const newMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  const addAssistantMessage = (content: string) => {
    const newMessage: AIMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  const sendMessage = async (content: string, files?: { mimeType: string; data: string; name: string; type: string }[]) => {
    if (!content.trim() && (!files || files.length === 0)) {
      toast({
        title: 'Message is empty',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Add user message
      addUserMessage(content);
      
      // Create mock lead info from conversation context
      const mockLeadInfo: LeadInfo = {
        interests: state.messages.filter(m => m.role !== 'system').map(m => m.content),
        stage: 'discovery'
      };
      
      let aiResponse: string = 'I apologize, but I couldn\'t generate a response at this time.';
      
      if (chatService && isInitialized) {
        try {
          // Use our custom chat service
          aiResponse = await chatService.sendMessage(content, mockLeadInfo);
        } catch (chatServiceError) {
          console.error('Error with chat service:', chatServiceError);
          // Fall back to default response
        }
      }
      
      // Add the assistant message
      addAssistantMessage(aiResponse);
      
      // Generate a suggested response
      const suggestedPrompt = generateSuggestedResponse(aiResponse, mockLeadInfo);
      if (suggestedPrompt) {
        dispatch({ type: 'SET_SUGGESTED_RESPONSE', payload: suggestedPrompt });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
      
      // Show messages container when first message is sent
      if (!state.showMessages) {
        dispatch({ type: 'SET_SHOW_MESSAGES', payload: true });
      }
    }
  };

  const clearMessages = async () => {
    if (chatService && isInitialized) {
      await chatService.clearHistory(personaData);
      const history = chatService.getHistory();
      dispatch({ type: 'SET_MESSAGES', payload: convertToAIMessages(history) });
    } else {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
    
    dispatch({ type: 'SET_SHOW_MESSAGES', payload: false });
    dispatch({ type: 'SET_SUGGESTED_RESPONSE', payload: null });
    
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed.',
    });
  };

  const toggleFullScreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  // Generate suggested responses based on conversation context
  const generateSuggestedResponse = (aiMessage: string, leadInfo: LeadInfo): string | null => {
    if (!leadInfo || !leadInfo.stage) {
      return null;
    }
    
    const containsQuestion = aiMessage.includes('?');
    if (!containsQuestion) {
      return null;
    }
    
    switch (leadInfo.stage) {
      case 'discovery':
        return 'Tell me more about your AI needs';
      case 'qualification':
        return 'Yes, I\'d like to learn more';
      case 'interested':
        return 'I\'d like to schedule a consultation';
      case 'ready-to-book':
        return 'Next week would work for me';
      default:
        return null;
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
        addUserMessage,
        addAssistantMessage,
        containerRef,
        chatService,
        isInitialized
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
