
import { useState, useEffect, useRef } from 'react';
import { useGemini } from '@/components/copilot/GeminiProvider';
import { GeminiMultimodalChat } from '@/services/gemini';

/**
 * Hook to handle Gemini API initialization
 */
export function useGeminiInitialization() {
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, isLoading: isProviderLoading, error: providerError, personaData } = useGemini();
  const multimodalChatRef = useRef<GeminiMultimodalChat | null>(null);
  
  // Initialize multimodal chat session
  useEffect(() => {
    if (isInitialized && !multimodalChatRef.current) {
      try {
        const config = localStorage.getItem('GEMINI_CONFIG');
        if (config) {
          const { apiKey } = JSON.parse(config);
          if (apiKey) {
            multimodalChatRef.current = new GeminiMultimodalChat({
              apiKey,
              model: 'gemini-2.0-vision', // Updated to use the correct model name
              speechConfig: {
                voice_name: 'Charon'
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing multimodal chat:', error);
        setError('Failed to initialize chat. Please check your API key configuration.');
      }
    }
  }, [isInitialized]);

  // Get current persona from context
  const currentPersonaName = personaData?.personaDefinitions?.[personaData?.currentPersona]?.name || 'AI Assistant';

  // Check if API key is available from any source
  const hasApiKey = (): boolean => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Check localStorage
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return !!(config.apiKey || envApiKey);
      } catch (error) {
        return !!envApiKey;
      }
    }
    return !!envApiKey;
  };

  // Get the API key from localStorage or environment
  const getApiKey = (): string => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Check localStorage first as user-provided keys take precedence
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        return config.apiKey || envApiKey;
      } catch (error) {
        return envApiKey;
      }
    }
    return envApiKey;
  };

  return {
    isInitialized,
    isProviderLoading,
    error,
    providerError,
    currentPersonaName,
    multimodalChatRef,
    personaData,
    hasApiKey,
    getApiKey
  };
}
