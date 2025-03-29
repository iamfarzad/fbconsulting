
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
// Correct the import to use the consolidated config file
import API_CONFIG from '@/config/apiConfigConfig'; 
// Import helper functions from errorHandling utils
// Assuming these functions exist and are exported correctly now
// import { logDetailedError, categorizeError } from '@/utils/errorHandling'; 

type ConnectionStatusType = 'connected' | 'disconnected' | 'connecting' | 'error';

const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatusType>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkConnection = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      // Construct the health check URL using the base URL and endpoint path
      const healthCheckUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.DEFAULT_ENDPOINTS.HEALTH_CHECK}`;
      console.log("[useConnectionStatus] Checking health at:", healthCheckUrl);
      
      const response = await fetch(healthCheckUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json', // Expect JSON response
        },
        signal: AbortSignal.timeout(5000) // Add a timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log("[useConnectionStatus] Health check successful:", data);
        setStatus('connected');
        setError(null);
      } else {
        const errorText = await response.text();
        console.error(`[useConnectionStatus] Health check failed: ${response.status} ${response.statusText}`, errorText);
        const errorMessage = `Health check failed: ${response.status} ${response.statusText}. ${errorText}`;
        setError(errorMessage);
        setStatus('error');
        // logDetailedError('Health check API error', { status: response.status, text: errorText });
        // Optionally categorize error here if needed
        // const category = categorizeError(response.status, errorText);
        toast({
          title: "Connection Error",
          description: `Backend health check failed (${response.status}). Please check service status.`, 
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("[useConnectionStatus] Health check fetch error:", err);
      const errorMessage = err.name === 'TimeoutError' ? "Connection timeout during health check." : "Failed to connect to backend service.";
      setError(errorMessage);
      setStatus('error');
      // logDetailedError('Health check fetch error', err);
      // const category = categorizeError(err);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Initial check on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Optional: Periodic check (use with caution to avoid spamming)
  // useEffect(() => {
  //   const interval = setInterval(checkConnection, API_CONFIG.HEALTH_CHECK.INTERVAL);
  //   return () => clearInterval(interval);
  // }, [checkConnection]);

  const resetError = useCallback(() => {
    setError(null);
    // Optionally re-check connection immediately after resetting error
    // if (status === 'error') {
    //   checkConnection();
    // }
  }, []);

  return { status, error, checkConnection, resetError };
};

export default useConnectionStatus;
