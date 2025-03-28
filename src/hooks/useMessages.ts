
import { useState, useCallback } from 'react';
import { AIMessage } from '@/features/gemini/types';

export function useMessages() {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const addUserMessage = useCallback((content: string) => {
    const message: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    const message: AIMessage = {
      role: 'assistant',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    clearMessages
  };
}

export default useMessages;
