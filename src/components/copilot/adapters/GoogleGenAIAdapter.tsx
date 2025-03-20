import { useEffect, useState } from 'react';
import { GoogleGenAIConfig, initializeGoogleGenAI } from '@/services/copilot/googleGenAIAdapter';
import useGeminiAPI from '@/hooks/useGeminiAPI';

/**
 * GoogleGenAIAdapter
 * 
 * A runtime adapter for Google GenAI (Gemini) to be used with CopilotKit.
 * This adapter handles the connection to Google's Gemini models and provides
 * the necessary configuration for CopilotKit to use these models.
 */
export interface GoogleGenAIAdapterProps {
  config?: Partial<GoogleGenAIConfig>;
  onConfigReady?: (config: GoogleGenAIConfig) => void;
  onError?: (error: Error) => void;
}

export const GoogleGenAIAdapter: React.FC<GoogleGenAIAdapterProps> = ({
  config = {},
  onConfigReady,
  onError
}) => {
  const [adapterConfig, setAdapterConfig] = useState<GoogleGenAIConfig | null>(null);
  const { apiKey } = useGeminiAPI();

  useEffect(() => {
    if (!apiKey) {
      console.warn('Google GenAI API Key not found in context');
      return;
    }

    try {
      // Initialize the adapter with the API key from context and any provided config
      const fullConfig = initializeGoogleGenAI({
        apiKey,
        ...config
      });

      setAdapterConfig(fullConfig);
      
      // Notify parent component that config is ready
      if (onConfigReady) {
        onConfigReady(fullConfig);
      }

      console.log('Google GenAI Adapter initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google GenAI Adapter', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [apiKey, config, onConfigReady, onError]);

  // This component doesn't render anything, it just sets up the adapter
  return null;
};

/**
 * Custom hook to create a Google Generative AI adapter configuration for CopilotKit
 */
export const useGoogleGenAIAdapter = (config?: Partial<GoogleGenAIConfig>) => {
  const [adapterConfig, setAdapterConfig] = useState<GoogleGenAIConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { apiKey } = useGeminiAPI();

  useEffect(() => {
    if (!apiKey) {
      setError(new Error('Google GenAI API Key not found'));
      return;
    }

    // Exit early if no API key is provided
    if (!apiKey) {
      setError(new Error('Google GenAI API Key not found'));
      return;
    }

    try {
      // Ensure API key is trimmed and validate it's not empty
      const trimmedKey = apiKey.trim();
      if (trimmedKey === '') {
        setError(new Error('API key cannot be empty'));
        return;
      }

      const fullConfig = initializeGoogleGenAI({
        apiKey: trimmedKey,
        ...config
      });
      
      setAdapterConfig(fullConfig);
      setError(null);
    } catch (err) {
      console.error('Error initializing Google GenAI Adapter', err);
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error initializing Google GenAI Adapter'));
      }
    }
  }, [apiKey, config]);

  return {
    adapter: adapterConfig,
    error,
    isReady: !!adapterConfig && !error
  };
};
