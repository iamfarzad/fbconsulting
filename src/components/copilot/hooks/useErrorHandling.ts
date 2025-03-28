
import { useEffect } from 'react';

/**
 * Hook to handle various error scenarios in Copilot
 */
export function useErrorHandling(connectionStatus: string, connectionError: string | null) {
  // Error handling for WebSocket connection failures
  useEffect(() => {
    if (connectionStatus === 'error' && connectionError) {
      console.error('WebSocket connection error:', connectionError);
    }
  }, [connectionStatus, connectionError]);

  // Error handling for resource loading failures
  useEffect(() => {
    const handleResourceError = (event: Event) => {
      console.error('Resource loading error:', event);
    };

    window.addEventListener('error', handleResourceError);

    return () => {
      window.removeEventListener('error', handleResourceError);
    };
  }, []);

  // Error handling for THREE.WebGLRenderer context lost error
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      console.error('THREE.WebGLRenderer context lost:', event);
    };

    window.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);
}
