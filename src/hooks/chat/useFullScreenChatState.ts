
import { useState, useCallback } from 'react';
import { AIMessage } from '@/types/chat';

export interface UseFullScreenChatStateOptions {
  initialMessages?: AIMessage[];
}

export const useFullScreenChatState = (initialMessages: AIMessage[] = []) => {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);

  // Add a new message
  const addMessage = useCallback((message: AIMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages
  };
};

export default useFullScreenChatState;
