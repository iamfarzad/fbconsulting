import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the Gemini API key
 * @returns Object containing the API key and loading state
 */
export const useGeminiAPI = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    setApiKey(key || null);
    setIsLoading(false);
  }, []);

  return {
    apiKey,
    isLoading
  };
};

export default useGeminiAPI;
