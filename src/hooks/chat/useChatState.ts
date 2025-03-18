
import { useState } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { toast } from 'sonner';

export const useChatState = (initialMessages: AIMessage[] = []) => {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (message: AIMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    const welcomeMessage = messages.find(m => m.role === 'assistant' && m.content.includes('Hello'));
    setMessages(welcomeMessage ? [welcomeMessage] : []);
  };

  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error('Chat error', {
      description: errorMessage
    });
  };

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    setLoadingState,
    handleError
  };
};
