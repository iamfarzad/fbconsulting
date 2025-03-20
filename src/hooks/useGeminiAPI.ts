import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the Gemini API key
 * @returns Object containing the API key and loading state
 */
export const useGeminiAPI = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // First check environment variable
    let key = import.meta.env.VITE_GEMINI_API_KEY;

    // If not in env, check localStorage
    if (!key) {
      try {
        const config = localStorage.getItem('GEMINI_CONFIG');
        if (config) {
          const { apiKey: storedKey } = JSON.parse(config);
          if (storedKey && typeof storedKey === 'string' && storedKey.trim()) {
            key = storedKey.trim();
          }
        }
      } catch (error) {
        console.error('Error reading Gemini config from localStorage:', error);
      }
    }

    // Validate and clean the key
    if (key && typeof key === 'string') {
      key = key.trim();
      if (!key) {
        console.error('API key is empty after trimming');
        key = null;
      }
    } else {
      console.error('Invalid API key format');
      key = null;
    }

    // Set the API key from either source
    setApiKey(key || null);
    setIsLoading(false);
  }, []);

  return {
    apiKey,
    isLoading
  };
};

export default useGeminiAPI;
