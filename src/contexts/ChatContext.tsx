import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { AIMessage, ChatService, FileAttachment } from '@/services/chat/types';
import { getChatService } from '@/services/chat/googleGenAIService.tsx';
import { toast } from '@/components/ui/use-toast';
import { chatReducer } from './chat/chatReducer';
import { ChatContextType, initialChatState } from './chat/types';
import { useGeminiWebSocket } from '@/services/gemini';

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}> = ({ children, apiKey: propApiKey, modelName: propModelName }) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<ChatService | null>(null);
  const { state: wsState, connect, disconnect, sendMessage: sendWsMessage } = useGeminiWebSocket();

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
      
      // Clear media items after sending
      dispatch({ type: 'CLEAR_MEDIA_ITEMS' });
      
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

  // Add a media item
  const addMediaItem = (item: { type: string; data: string; mimeType?: string; name?: string }) => {
    dispatch({ type: 'ADD_MEDIA_ITEM', payload: item });
  };

  // Remove a media item
  const removeMediaItem = (index: number) => {
    dispatch({ type: 'REMOVE_MEDIA_ITEM', payload: index });
  };

  // Clear all media items
  const clearMediaItems = () => {
    dispatch({ type: 'CLEAR_MEDIA_ITEMS' });
  };

  // Toggle voice functionality
  const toggleVoice = (enable?: boolean) => {
    dispatch({ type: 'TOGGLE_VOICE', payload: enable });
  };

  const value = {
    state,
    dispatch,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    containerRef,
    isInitialized: state.isInitialized,
    addMediaItem,
    removeMediaItem,
    clearMediaItems,
    toggleVoice,
    connect,
    disconnect,
    sendWsMessage
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
