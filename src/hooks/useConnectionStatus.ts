import { useState, useEffect } from 'react';
import { apiConfig } from '@/config/api';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const { geminiApiKey } = apiConfig;

  useEffect(() => {
    // If we have an API key, set connected to true
    if (geminiApiKey) {
      setIsConnected(true);
      return;
    }

    // Otherwise, check if the API is available by making a health check
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        setIsConnected(response.ok);
      } catch (error) {
        console.error('API connection check failed:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [geminiApiKey]);

  return { isConnected };
}
