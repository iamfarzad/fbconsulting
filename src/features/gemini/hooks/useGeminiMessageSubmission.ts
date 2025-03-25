import { useState, useCallback } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';

interface UseGeminiMessageSubmissionProps {
  addMessage: (role: 'user' | 'assistant' | 'error', content: string) => void;
  setIsLoading: (loading: boolean) => void;
  clearImages: () => void;
}

/**
 * Hook to handle sending and processing Gemini chat messages
 */
export function useGeminiMessageSubmission({
  addMessage,
  setIsLoading,
  clearImages
}: UseGeminiMessageSubmissionProps) {
  const [error, setError] = useState<string | null>(null);
  const { personaData } = useGemini();

  const handleSendMessage = useCallback(async (
    inputValue: string,
    images: { mimeType: string; data: string }[],
    isListening: boolean,
    stopListening: () => void
  ) => {
    if (!inputValue.trim()) return;
    
    if (isListening) {
      stopListening();
    }
    
    addMessage('user', inputValue);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/gemini/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          images,
          persona: personaData?.currentPersona
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }
      
      const { text } = await response.json();
      addMessage('assistant', text);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      addMessage('error', `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
      clearImages();
    }
  }, [addMessage, setIsLoading, clearImages, personaData]);

  return {
    error,
    handleSendMessage
  };
}
