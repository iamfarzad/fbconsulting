
import React, { createContext, useContext, useReducer, useRef } from 'react';
import { AIMessage, FileAttachment } from '@/types/chat'; // Import from types/chat
import { toast } from '@/components/ui/use-toast';
import { chatReducer } from './chat/chatReducer';
import { ChatContextType, initialChatState } from './chat/types';
import { useGemini } from '@/hooks/gemini';

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component with apiKey and modelName props
export const ChatProvider: React.FC<{ 
  children: React.ReactNode;
  apiKey?: string;
  modelName?: string;
}> = ({ 
  children,
  apiKey,
  modelName
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const containerRef = useRef<HTMLDivElement>(null);
  const gemini = useGemini(); // Get context from GeminiProvider

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
      
      // Use sendMessage from GeminiProvider context
      if (gemini.isConnected) {
        await gemini.sendMessage(content);
      } else {
        // Handle disconnected state or show error
        const errorMsg = 'WebSocket not connected';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
        const errorResponse: AIMessage = {
          role: 'error',
          content: `Error: ${errorMsg}`,
          timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: errorResponse });
        toast({
          title: 'Connection Error',
          description: errorMsg,
          variant: 'destructive',
        });
      }
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

  // Value object with all context properties
  const value = {
    state,
    dispatch,
    sendMessage,
    clearMessages,
    toggleFullScreen,
    containerRef,
    isInitialized: gemini.isConnected,
    isLoading: state.isLoading || gemini.isConnecting,
    error: state.error || gemini.error,
    addMediaItem,
    removeMediaItem,
    clearMediaItems,
    toggleVoice
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
