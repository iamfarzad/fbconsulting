
import { useState } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';

export function useGeminiInitialization() {
  const [error, setError] = useState<string | null>(null);
  const geminiContext = useGemini();

  const hasApiKey = (): boolean => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!envApiKey;
  };

  const getApiKey = (): string => {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  };

  return {
    isInitialized: true,
    isProviderLoading: false,
    error,
    providerError: null,
    currentPersonaName: 'AI Assistant',
    hasApiKey,
    getApiKey
  };
}

export default useGeminiInitialization;
