
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';

/**
 * Hook to manage connection status for the Copilot API
 */
export function useConnectionStatus(enabled: boolean, apiKey: string | null, isLoading: boolean) {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return; // Don't connect if copilot is disabled

    if (isLoading) {
      setConnectionStatus('connecting');
      return;
    }
    
    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key not found');
      toast({
        title: 'AI Configuration Error',
        description: 'API key not found. Please check your configuration.',
        variant: 'destructive'
      });
    } else {
      const testConnection = async () => {
        try {
          setConnectionStatus('connecting');
          
          const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API connection failed: ${response.status} ${response.statusText}${
              errorData.error ? ` - ${errorData.error.message || ''}` : ''
            }`);
          }
          
          setConnectionStatus('connected');
          setConnectionError(null);
        } catch (error) {
          logDetailedError(error, {
            component: 'CopilotProvider',
            apiKeyLength: apiKey?.length,
            apiKeyPresent: !!apiKey
          });
          
          setConnectionStatus('error');
          const errorMessage = formatErrorMessage(error);
          setConnectionError(errorMessage);
          
          const errorCategory = categorizeError(error);
          let toastTitle = 'API Connection Error';
          let toastDescription = 'Failed to connect to the Gemini API. Please check your network connection.';
          
          if (errorCategory === 'auth') {
            toastTitle = 'API Key Error';
            toastDescription = 'Invalid or expired API key. Please check your API key configuration.';
          }
          
          toast({
            title: toastTitle,
            description: toastDescription,
            variant: 'destructive'
          });
        }
      };
      
      testConnection();
    }
  }, [apiKey, isLoading, enabled]);

  return {
    connectionStatus,
    connectionError,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    showConnectionStatus: connectionStatus === 'error' || connectionStatus === 'connecting'
  };
}
