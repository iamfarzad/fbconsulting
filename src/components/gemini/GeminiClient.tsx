
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AIMessage } from '@/types/chat';
import { toast } from '@/components/ui/use-toast';

interface GeminiClientContextType {
  sendMessage: (content: string) => Promise<AIMessage>;
  generateAudio: (text: string) => Promise<Blob | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const GeminiClientContext = createContext<GeminiClientContextType | null>(null);

export const useGeminiClient = () => {
  const context = useContext(GeminiClientContext);
  if (!context) {
    throw new Error('useGeminiClient must be used within a GeminiClientProvider');
  }
  return context;
};

interface GeminiClientProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export const GeminiClientProvider: React.FC<GeminiClientProviderProps> = ({ 
  children, 
  apiKey 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send a chat message to the Gemini API
  const sendMessage = useCallback(async (content: string): Promise<AIMessage> => {
    try {
      setIsLoading(true);
      setError(null);

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to communicate with Gemini API');
      }

      const data = await response.json();
      
      // Create and return message
      return {
        role: 'assistant',
        content: data.content || '',
        timestamp: Date.now(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate audio from text using Gemini's TTS
  const generateAudio = useCallback(async (text: string): Promise<Blob | null> => {
    try {
      setIsLoading(true);
      setError(null);

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
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to generate audio');
      }

      return await response.blob();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
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
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    sendMessage,
    generateAudio,
    isLoading,
    error,
    clearError,
  };

  return (
    <GeminiClientContext.Provider value={value}>
      {children}
    </GeminiClientContext.Provider>
  );
};

export default GeminiClientProvider;
