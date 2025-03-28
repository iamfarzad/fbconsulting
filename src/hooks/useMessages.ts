
import { useState, useCallback } from 'react';
import { AIMessage } from '@/types/chat';
import { generateId } from '@/lib/utils';

interface UseMessagesOptions {
  initialMessages?: AIMessage[];
  maxMessages?: number;
}

export function useMessages(options: UseMessagesOptions = {}) {
  const { initialMessages = [], maxMessages = 100 } = options;
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  
  // Add a user message
  const addUserMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    const message: AIMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      id: generateId()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, message];
      // Limit to maxMessages
      if (newMessages.length > maxMessages) {
        return newMessages.slice(newMessages.length - maxMessages);
      }
      return newMessages;
    });
    
    return message;
  }, [maxMessages]);
  
  // Add an assistant message
  const addAssistantMessage = useCallback((content: string) => {
    if (!content) return;
    
    const message: AIMessage = {
      role: 'assistant',
      content: content,
      timestamp: Date.now(),
      id: generateId()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, message];
      // Limit to maxMessages
      if (newMessages.length > maxMessages) {
        return newMessages.slice(newMessages.length - maxMessages);
      }
      return newMessages;
    });
    
    return message;
  }, [maxMessages]);
  
  // Add a system message
  const addSystemMessage = useCallback((content: string) => {
    if (!content) return;
    
    const message: AIMessage = {
      role: 'system',
      content: content,
      timestamp: Date.now(),
      id: generateId()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, message];
      // Limit to maxMessages
      if (newMessages.length > maxMessages) {
        return newMessages.slice(newMessages.length - maxMessages);
      }
      return newMessages;
    });
    
    return message;
  }, [maxMessages]);
  
  // Add an error message
  const addErrorMessage = useCallback((content: string) => {
    if (!content) return;
    
    const message: AIMessage = {
      role: 'error',
      content: content,
      timestamp: Date.now(),
      id: generateId()
    };
    
    setMessages(prev => {
      const newMessages = [...prev, message];
      // Limit to maxMessages
      if (newMessages.length > maxMessages) {
        return newMessages.slice(newMessages.length - maxMessages);
      }
      return newMessages;
    });
    
    return message;
  }, [maxMessages]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    addErrorMessage,
    clearMessages,
    setMessages
  };
}
