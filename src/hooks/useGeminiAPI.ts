
import { useState } from 'react';

export const useGeminiAPI = () => {
  const [error, setError] = useState<Error | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On component mount, try to get API key from environment
  useState(() => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
    }
  });

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        body: JSON.stringify({ prompt: message }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setIsLoading(false);
      return data.text;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
      throw err;
    }
  };

  return { sendMessage, error, apiKey, isLoading, setApiKey };
};

export default useGeminiAPI;
