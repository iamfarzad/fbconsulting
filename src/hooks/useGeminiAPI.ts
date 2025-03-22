import { useState, useCallback } from 'react';
import { GoogleGenAIChatService } from '@/services/chat/googleGenAIService';

let chatService: GoogleGenAIChatService | null = null;

export function useGeminiAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.VITE_GOOGLE_API_KEY || '';

  const initializeService = useCallback(() => {
    if (!chatService && apiKey) {
      chatService = new GoogleGenAIChatService({
        apiKey,
        modelName: 'gemini-2.0-flash',
        temperature: 0.7,
        maxOutputTokens: 2048
      });
    }
    return chatService;
  }, [apiKey]);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const service = initializeService();
      if (!service) {
        throw new Error('Chat service not initialized');
      }

      const response = await service.sendMessage(message);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [initializeService]);

  return {
    sendMessage,
    isLoading,
    error,
    apiKey
  };
}
