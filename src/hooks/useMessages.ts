
import { useState, useEffect, useCallback } from 'react';
import { 
  AIMessage, 
  saveConversationHistory,
  loadConversationHistory
} from '@/services/copilotService';
import { trackEvent } from '@/services/analyticsService';

export const useMessages = (initialMessages?: AIMessage[]) => {
  // State for messages
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    return initialMessages || loadConversationHistory();
  });
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory(messages);
    }
  }, [messages]);
  
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
  }, []);
  
  // Add an assistant message to the conversation
  const addAssistantMessage = useCallback((content: string) => {
    const assistantMessage: AIMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Track response received
    trackEvent({
      action: 'chat_response_received',
      category: 'chatbot',
      label: 'ai_response',
      response_length: content.length
    });
    
    // Return the created message for potential further processing
    return assistantMessage;
  }, []);
  
  // Add an error message
  const addErrorMessage = useCallback((error: any) => {
    const errorMessage: AIMessage = {
      role: 'assistant',
      content: "I'm sorry, I'm having trouble processing your request. Please try again in a moment.",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, errorMessage]);
    
    // Track error
    trackEvent({
      action: 'chat_error',
      category: 'error',
      label: 'message_processing',
      error: String(error)
    });
    
    return errorMessage;
  }, []);
  
  // Clear the conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    saveConversationHistory([]);
    
    // Track clear action
    trackEvent({
      action: 'chat_cleared',
      category: 'chatbot',
      label: 'conversation_reset'
    });
  }, []);
  
  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    clearMessages
  };
};
