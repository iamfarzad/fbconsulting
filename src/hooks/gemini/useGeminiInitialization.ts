
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
              model: 'gemini-2.0-vision'
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

  return {
    isInitialized,
    isProviderLoading,
    error,
    providerError,
    currentPersonaName,
    multimodalChatRef,
    personaData
  };
}
