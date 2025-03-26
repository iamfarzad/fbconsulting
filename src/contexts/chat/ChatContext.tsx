import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatContextType, 
  ChatProviderProps, 
  ChatState, 
  MediaItem, 
  Message, 
  MessageFeedback 
} from './types';
import { chatReducer, initialChatState } from './chatReducer';

// Create the context with a default undefined value
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children, 
  initialState = {} 
}) => {
  // Initialize reducer with merged initial state
  const [state, dispatch] = useReducer(
    chatReducer, 
    { ...initialChatState, ...initialState }
  );

  // Define helper functions for common operations
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create a unique ID for the message
    const userMessageId = uuidv4();
    
    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: content,
      createdAt: new Date(),
      mediaItems: state.mediaItems.length > 0 ? [...state.mediaItems] : undefined
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Add a placeholder for the assistant's response
      const assistantMessageId = uuidv4();
      const loadingMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        isLoading: true
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: loadingMessage });
      
      // TODO: Call your API service here to get the AI response
      // const response = await geminiService.sendMessage(content, state.currentPersona);
      
      // For now, let's simulate a response
      const simulatedResponse = "This is a simulated response. Replace with actual API call.";
      
      // Update the loading message with the actual response
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: assistantMessageId, 
          updates: { 
            content: simulatedResponse,
            isLoading: false 
          } 
        } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as Error });
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'error',
        content: `Error: ${(error as Error).message}`,
        createdAt: new Date()
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_MEDIA_ITEMS' });
    }
  };

  const addUserMessage = (content: string) => {
    if (!content.trim()) return;
    
    const message: Message = {
      id: uuidv4(),
      role: 'user',
      content: content,
      createdAt: new Date(),
      mediaItems: state.mediaItems.length > 0 ? [...state.mediaItems] : undefined
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: message });
    dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const setInputValue = (value: string) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: value });
  };

  const addMediaItem = (item: MediaItem) => {
    dispatch({ type: 'ADD_MEDIA_ITEM', payload: item });
  };

  const removeMediaItem = (id: string) => {
    dispatch({ type: 'REMOVE_MEDIA_ITEM', payload: id });
  };

  const toggleFullScreen = () => {
    dispatch({ type: 'TOGGLE_FULL_SCREEN' });
  };

  const setMessageFeedback = (messageId: string, feedback: MessageFeedback) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        id: messageId,
        updates: { feedback }
      }
    });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    state,
    dispatch,
    sendMessage,
    addUserMessage,
    clearChat,
    setInputValue,
    addMediaItem,
    removeMediaItem,
    toggleFullScreen,
    setMessageFeedback
  }), [state]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
