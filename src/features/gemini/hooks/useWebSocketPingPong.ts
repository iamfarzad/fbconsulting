
import { useRef, useCallback } from 'react';

interface PingPongOptions {
  pingInterval: number;
  pingTimeout: number;
  onPingTimeout: () => void;
}

/**
 * Hook for managing WebSocket ping/pong functionality
 */
export function useWebSocketPingPong({ 
  pingInterval, 
  pingTimeout, 
  onPingTimeout 
}: PingPongOptions) {
  const pingIntervalId = useRef<number | null>(null);
  const pingTimeoutId = useRef<number | null>(null);
  
  /**
   * Clear all ping/pong timers
   */
  const clearTimers = useCallback(() => {
    if (pingIntervalId.current) {
      clearInterval(pingIntervalId.current);
      pingIntervalId.current = null;
    }
    
    if (pingTimeoutId.current) {
      clearTimeout(pingTimeoutId.current);
      pingTimeoutId.current = null;
    }
  }, []);
  
  /**
   * Clear only the ping timeout
   */
  const clearPingTimeout = useCallback(() => {
    if (pingTimeoutId.current) {
      clearTimeout(pingTimeoutId.current);
      pingTimeoutId.current = null;
    }
  }, []);
  
  /**
   * Start ping/pong mechanism
   */
  const startPingPong = useCallback((ws: WebSocket) => {
    // Clear existing timers
    clearTimers();
    
    // Setup ping interval
    pingIntervalId.current = window.setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send ping
        ws.send(JSON.stringify({ type: 'ping' }));
        
        // Set timeout for pong response
        pingTimeoutId.current = window.setTimeout(() => {
          console.warn('WebSocket ping timeout - no pong received');
          clearPingTimeout();
          onPingTimeout();
        }, pingTimeout);
      }
    }, pingInterval);
  }, [clearTimers, clearPingTimeout, onPingTimeout, pingInterval, pingTimeout]);
  
  return {
    startPingPong,
    clearPingTimeout,
    clearTimers
  };
}

export default useWebSocketPingPong;
