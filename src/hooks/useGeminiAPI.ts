
import { useState } from 'react';

export const useGeminiAPI = () => {
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        body: JSON.stringify({ prompt: message }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.text;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  return { sendMessage, error };
};

// Fix imports in other files by exporting the same function as default
export default useGeminiAPI;
