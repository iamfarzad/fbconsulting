import { useState, useEffect, useRef } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
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
        // First check environment variable
        let apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        // If not in env, check localStorage
        if (!apiKey) {
          const config = localStorage.getItem('GEMINI_CONFIG');
          if (config) {
            const { apiKey: storedKey } = JSON.parse(config);
            apiKey = storedKey;
          }
        }

        if (apiKey) {
          multimodalChatRef.current = new GeminiMultimodalChat({
            apiKey,
            model: 'gemini-2.0-flash-vision',
            speechConfig: {
              voice_name: 'Charon'
            }
          });
        } else {
          setError('No API key found. Please check your environment variables or configuration.');
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
    // First check environment variable
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey) return true;
    
    // Then check localStorage
    try {
      const savedConfig = localStorage.getItem('GEMINI_CONFIG');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        return !!config.apiKey;
      }
    } catch (error) {
        console.error('Error parsing localStorage config:', error);
        return false;
    }
    return false;
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

export default useGeminiInitialization;
