
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { formatErrorMessage, logDetailedError, categorizeError } from '@/utils/errorHandling';

/**
 * Hook to manage connection status for the Copilot API
 */
export function useConnectionStatus(enabled: boolean, apiKey: string | null, isLoading: boolean) {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldShowToast, setShouldShowToast] = useState(true);
  
  const MAX_RETRIES = 3;
  
  const testConnection = useCallback(async () => {
    if (!apiKey) {
      setConnectionStatus('error');
      setConnectionError('API key not found');
      
      if (shouldShowToast) {
        toast({
          title: 'AI Configuration Error',
          description: 'API key not found. Please check your configuration.',
          variant: 'destructive'
        });
        setShouldShowToast(false); // Only show toast once
      }
      return;
    }
    
    try {
      setConnectionStatus('connecting');
      
      // First check if our local backend is available
      const healthCheckResponse = await fetch('/api/health')
        .then(res => res.ok)
        .catch(() => false);
        
      if (healthCheckResponse) {
        console.log('Local API health check passed');
        setConnectionStatus('connected');
        setConnectionError(null);
        setRetryCount(0);
        return;
      }
      
      // Fall back to direct Gemini API check
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API connection failed: ${response.status} ${response.statusText}${
          errorData.error ? ` - ${errorData.error.message || ''}` : ''
        }`);
      }
      
      console.log('Direct Gemini API connection successful');
      setConnectionStatus('connected');
      setConnectionError(null);
      setRetryCount(0);
      setShouldShowToast(true); // Reset toast flag on successful connection
      
    } catch (error) {
      logDetailedError(error, {
        component: 'ConnectionStatus',
        apiKeyLength: apiKey?.length,
        apiKeyPresent: !!apiKey
      });
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES) {
        console.log(`Connection failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        
        // Wait a bit before retrying
        setTimeout(() => {
          testConnection();
        }, 2000 * (retryCount + 1)); // Exponential backoff
        
        return;
      }
      
      setConnectionStatus('error');
      const errorMessage = formatErrorMessage(error);
      setConnectionError(errorMessage);
      
      if (shouldShowToast) {
        const errorCategory = categorizeError(error);
        let toastTitle = 'API Connection Error';
        let toastDescription = 'Failed to connect to the Gemini API. The app will continue to work with limited functionality.';
        
        if (errorCategory === 'auth') {
          toastTitle = 'API Key Error';
          toastDescription = 'Invalid or expired API key. Please check your API key configuration.';
        }
        
        toast({
          title: toastTitle,
          description: toastDescription,
          variant: 'destructive'
        });
        
        setShouldShowToast(false); // Only show toast once
      }
    }
  }, [apiKey, retryCount, shouldShowToast]);

  useEffect(() => {
    if (!enabled) return; // Don't connect if copilot is disabled

    if (isLoading) {
      setConnectionStatus('connecting');
      return;
    }
    
    // Reset state when apiKey changes
    if (apiKey) {
      setRetryCount(0);
      setShouldShowToast(true);
      testConnection();
    }
    
  }, [apiKey, isLoading, enabled, testConnection]);

  return {
    connectionStatus,
    connectionError,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    showConnectionStatus: connectionStatus === 'error' || connectionStatus === 'connecting',
    retry: testConnection
  };
}
