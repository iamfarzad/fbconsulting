
import { useState, useCallback } from 'react';
import { 
  AIMessage
} from '@/services/chat/messageTypes';
import {
  saveConversationHistory,
  loadConversationHistory
} from '@/services/storage/localStorageManager';
import { trackEvent } from '@/services/analyticsService';
import { useMessageStorage } from './useMessageStorage';
import { useMessageTracking } from './useMessageTracking';

/**
 * Hook for managing chat messages with persistence and tracking
 */
export const useMessages = (initialMessages?: AIMessage[]) => {
  // Message state management with persistence
  const { 
    messages, 
    setMessages, 
    persistMessages 
  } = useMessageStorage(initialMessages);
  
  // Analytics tracking for message events
  const { trackMessageEvent } = useMessageTracking();
  
  // Add a user message to the conversation
  const addUserMessage = useCallback((content: string) => {
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Return the created message for potential further processing
    return userMessage;
  }, [setMessages]);
  
  // Add an assistant message to the conversation
  const addAssistantMessage = useCallback((content: string) => {
    const assistantMessage: AIMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Track response received
    trackMessageEvent('chat_response_received', 'chatbot', 'ai_response', {
      response_length: content.length
    });
    
    // Return the created message for potential further processing
    return assistantMessage;
  }, [setMessages, trackMessageEvent]);
  
  // Add an error message
  const addErrorMessage = useCallback((error: any) => {
    const errorMessage: AIMessage = {
      role: 'assistant',
      content: "I'm sorry, I'm having trouble processing your request. Please try again in a moment.",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, errorMessage]);
    
    // Track error
    trackMessageEvent('chat_error', 'error', 'message_processing', {
      error: String(error)
    });
    
    return errorMessage;
  }, [setMessages, trackMessageEvent]);
  
  // Clear the conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    persistMessages([]);
    
    // Track clear action
    trackMessageEvent('chat_cleared', 'chatbot', 'conversation_reset');
  }, [setMessages, persistMessages, trackMessageEvent]);
  
  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    clearMessages
  };
};
