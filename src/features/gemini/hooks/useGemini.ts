import { useState, useCallback } from 'react';
import { useGeminiAPI } from '@/providers/GeminiAPIProvider';
import type { Message } from '@/features/gemini/types';
import type { MessageMedia } from '@/features/gemini/types/media';

export interface UseGeminiReturn {
  isInitialized: boolean;
  handleSendMessage: (content: string, media?: MessageMedia) => Promise<void>;
  error: string | null;
}

export const useGemini = (): UseGeminiReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useGeminiAPI();

  const handleSendMessage = useCallback(async (content: string, media?: MessageMedia) => {
    if (!apiKey) {
      setError('API key not found');
      return;
    }

    try {
      // TODO: Implement actual Gemini API call
      console.log('Sending message to Gemini:', { content, media });
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    }
  }, [apiKey]);

  return {
    isInitialized,
    handleSendMessage,
    error
  };
};
