
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { config } from '@/config/Config';

export function useGeminiInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setIsLoading(true);
        const apiKey = config.getApiKey('gemini');
        
        if (!apiKey) {
          setError('No API key found for Gemini API');
          setIsInitialized(false);
          return;
        }
        
        // Check API connection
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH_CHECK}`);
        
        if (!response.ok) {
          setError(`API health check failed: ${response.statusText}`);
          setIsInitialized(false);
          return;
        }
        
        setError(null);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize Gemini API');
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApiKey();
  }, []);
  
  const hasApiKey = () => {
    return !!config.getApiKey('gemini');
  };
  
  const getApiKey = () => {
    return config.getApiKey('gemini') || '';
  };
  
  return {
    isInitialized,
    isLoading,
    error,
    hasApiKey,
    getApiKey
  };
}
