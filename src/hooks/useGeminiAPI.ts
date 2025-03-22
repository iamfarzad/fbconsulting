import { useState, useCallback } from 'react';
import { ChatMessage, getChatService } from '@/services/chat/googleGenAIService';

const useGeminiAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const chatService = getChatService();
      const response = await chatService.sendMessage(message);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistory = useCallback((): ChatMessage[] => {
    try {
      const chatService = getChatService();
      return chatService.getHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    }
  }, []);

  return {
    sendMessage,
    getHistory,
    isLoading,
    error
  };
};

export default useGeminiAPI;
