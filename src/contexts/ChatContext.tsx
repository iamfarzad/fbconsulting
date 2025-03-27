import React, { createContext, useContext, useReducer, useRef } from 'react';
import { AIMessage, FileAttachment } from '@/services/chat/types'; // Keep types if needed
// Removed: import { getChatService } from '@/services/chat/googleGenAIService.tsx';
import { toast } from '@/components/ui/use-toast';
import { chatReducer } from './chat/chatReducer';
import { ChatContextType, initialChatState } from './chat/types';
import { useGemini } from '@/components/copilot/providers/GeminiProvider'; // Import useGemini

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
// Removed apiKey and modelName props
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const containerRef = useRef<HTMLDivElement>(null);
  // Removed: const chatServiceRef = useRef<ChatService | null>(null);
  const gemini = useGemini(); // Get context from GeminiProvider

  // Removed: useEffect for initializing chatServiceRef

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
        // Note: GeminiProvider's sendMessage might need adaptation 
        // if it doesn't support files or message history directly.
        // For now, just send the content.
        await gemini.sendMessage(content);
        // The response handling might need adjustment too, 
        // as GeminiProvider handles responses via WebSocket `onmessage`.
        // We might need to listen to state changes provided by GeminiProvider
        // or adjust how messages are added here.
        // Placeholder: Assume response is handled by GeminiProvider for now.
        // dispatch({ type: 'ADD_MESSAGE', payload: response }); 
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
    // Removed chatServiceRef call
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

  // Update value to use gemini context where applicable
  const value = {
    state,
    dispatch,
    sendMessage, // Use the updated sendMessage
    clearMessages,
    toggleFullScreen,
    containerRef,
    isInitialized: gemini.isConnected, // Reflect WebSocket connection status
    isLoading: state.isLoading || gemini.isConnecting, // Combine loading states
    error: state.error || gemini.error, // Combine error states
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
