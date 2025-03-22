
import { useState, useCallback, useEffect } from 'react';
import { AIMessage } from '@/types/chat';
import { useToast } from './use-toast';
import useGeminiAPI from './useGeminiAPI';

interface UseUnifiedGeminiAPIOptions {
  autoConnect?: boolean;
}

export function useUnifiedGeminiAPI(options: UseUnifiedGeminiAPIOptions = {}) {
  const { autoConnect = true } = options;
  const { apiKey } = useGeminiAPI();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Connect to Gemini API
  useEffect(() => {
    if (autoConnect && apiKey) {
      testConnection();
    }
  }, [apiKey, autoConnect]);

  // Test connection to Gemini API
  const testConnection = useCallback(async () => {
    if (!apiKey) {
      setError('No API key provided');
      return false;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: 'connection_test',
          }],
          test: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Gemini API');
      }

      setIsConnected(true);
      setError(null);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      setError(errorMessage);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Send a message to Gemini
  const sendMessage = useCallback(async (content: string): Promise<AIMessage | null> => {
    if (!apiKey) {
      setError('No API key provided');
      return null;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content,
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to Gemini API');
      }

      const data = await response.json();
      
      return {
        role: 'assistant',
        content: data.content || '',
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);

  // Generate audio from text
  const generateAudio = useCallback(async (text: string): Promise<Blob | null> => {
    if (!apiKey) {
      setError('No API key provided');
      return null;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/gemini/audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          config: {
            voice: 'Charon',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      return await response.blob();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to generate audio',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);

  // Clear any errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    apiKey,
    isConnected,
    isLoading,
    error,
    sendMessage,
    generateAudio,
    testConnection,
    clearError,
  };
}

export default useUnifiedGeminiAPI;
