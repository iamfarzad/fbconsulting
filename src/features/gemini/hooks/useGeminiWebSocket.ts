import { useState, useEffect, useRef, useCallback } from 'react';
import { useMessage } from '@/contexts/MessageContext';
import { API_CONFIG } from '@/config/api';

interface WebSocketMessage {
  type: 'text' | 'error' | 'audio' | 'audio_meta' | 'complete' | 'pong';
  content?: string;
  error?: string;
  size?: number;
}

export interface UseGeminiWebSocketProps {
  onTextMessage?: (text: string) => void;
  onError?: (error: string) => void;
  onAudioChunk?: (chunk: Blob) => void;
  onComplete?: () => void;
}

/**
 * Hook to manage WebSocket connections for Gemini services
 */
export function useGeminiWebSocket({
  onTextMessage,
  onError,
  onAudioChunk,
  onComplete
}: UseGeminiWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const { setMessage } = useMessage();
  
  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 1000;

  const clearTimers = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current);
      pingTimeoutRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    clearTimers();
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    setIsConnected(false);
    setProgress(0);
  }, [clearTimers]);

  const setupHeartbeat = useCallback(() => {
    clearTimers();

    // Set up ping interval
    pingIntervalRef.current = setInterval(() => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({ type: 'ping' }));
        
        // Set up timeout for pong response
        pingTimeoutRef.current = setTimeout(() => {
          console.warn('WebSocket ping timeout - attempting reconnect');
          cleanup();
          connect();
        }, API_CONFIG.DEFAULT_WS_PING_TIMEOUT);
      }
    }, API_CONFIG.DEFAULT_WS_PING_INTERVAL);
  }, [cleanup]);

  const connect = useCallback(async () => {
    if (isConnecting || websocketRef.current) {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const clientId = Math.random().toString(36).substring(7);
      const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        setupHeartbeat();
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed');
        clearTimers();
        setIsConnected(false);
        websocketRef.current = null;
        
        // Attempt reconnection if under max attempts
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current++;
          setTimeout(() => connect(), RECONNECT_DELAY * reconnectAttempts.current);
        }
      };
      
      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnecting(false);
        if (onError) {
          onError('WebSocket connection error');
        }
      };
      
      ws.onmessage = async (event) => {
        if (event.data instanceof Blob) {
          if (onAudioChunk) {
            onAudioChunk(event.data);
          }
          setProgress(prev => Math.min(prev + 5, 95));
        } else {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);
            
            switch (data.type) {
              case 'text':
                if (data.content && onTextMessage) {
                  onTextMessage(data.content);
                  setMessage(data.content);
                }
                break;
              
              case 'error':
                if (data.error) {
                  setError(data.error);
                  if (onError) onError(data.error);
                }
                break;
              
              case 'complete':
                setProgress(100);
                if (onComplete) onComplete();
                break;

              case 'pong':
                // Clear the ping timeout since we got a response
                if (pingTimeoutRef.current) {
                  clearTimeout(pingTimeoutRef.current);
                  pingTimeoutRef.current = null;
                }
                break;
                
              default:
                console.warn('Unknown message type:', data.type);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        }
      };
      
      websocketRef.current = ws;
      
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect');
      setIsConnecting(false);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to connect');
      }
    }
  }, [isConnecting, onTextMessage, onError, onAudioChunk, onComplete, setMessage, setupHeartbeat]);

  const sendMessage = useCallback((text: string, enableTTS: boolean = true) => {
    if (!websocketRef.current || !isConnected) {
      setError('WebSocket not connected');
      return;
    }

    try {
      websocketRef.current.send(JSON.stringify({
        text,
        role: "user",
        enableTTS
      }));
      setProgress(0);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to send message');
      }
    }
  }, [isConnected, onError]);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);

  return {
    isConnected,
    isConnecting,
    error,
    progress,
    sendMessage,
    connect,
    disconnect: cleanup
  };
}

export default useGeminiWebSocket;
