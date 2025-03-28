import { useState } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';

export function useGeminiInitialization() {
  const [error, setError] = useState<string | null>(null);
  const { isInitialized, isLoading: isProviderLoading, error: providerError, personaData } = useGemini();

  const currentPersonaName = personaData?.personaDefinitions?.[personaData?.currentPersona]?.name || 'AI Assistant';

  const hasApiKey = (): boolean => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!envApiKey;
  };

  const getApiKey = (): string => {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  };

  return {
    isInitialized,
    isProviderLoading,
    error,
    providerError,
    currentPersonaName,
    personaData,
    hasApiKey,
    getApiKey
  };
}

export default useGeminiInitialization;
