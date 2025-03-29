
import { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to initialize and manage Gemini API connection
 */
export function useGeminiInitialization() {
  const [isProviderLoading, setIsProviderLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [providerError, setProviderError] = useState<string>('');
  const [currentPersonaName, setCurrentPersonaName] = useState<string | null>(null);
  const apiKeyRef = useRef<string | null>(null);
  const { toast } = useToast();

  // Check API key on initialization
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // First check if we have an API key
        const key = API_CONFIG.GEMINI_API_KEY;
        
        if (!key) {
          console.warn('No Gemini API key found. Some features may not work.');
          setProviderError('No API key found');
          setIsProviderLoading(false);
          return;
        }
        
        // Store the API key
        apiKeyRef.current = key;
        
        // Check if the API is accessible
        const healthCheckUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.DEFAULT_ENDPOINTS.healthCheck}`;
        const response = await fetch(healthCheckUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }
        
        // If all checks pass, set initialized to true
        setIsInitialized(true);
        setIsProviderLoading(false);
      } catch (error) {
        console.error('Error initializing Gemini:', error);
        setProviderError(error instanceof Error ? error.message : 'Unknown error');
        setIsProviderLoading(false);
        
        toast({
          title: 'Gemini Initialization Failed',
          description: error instanceof Error ? error.message : 'Failed to connect to Gemini service',
          variant: 'destructive'
        });
      }
    };
    
    checkApiKey();
  }, [toast]);

  // Check if API key is available
  const hasApiKey = () => {
    return !!apiKeyRef.current;
  };
  
  // Get the API key safely
  const getApiKey = () => {
    return apiKeyRef.current || '';
  };

  return {
    isInitialized,
    isProviderLoading,
    error: providerError,
    providerError,
    currentPersonaName,
    personaData: {
      currentPersona: currentPersonaName
    },
    hasApiKey,
    getApiKey
  };
}
