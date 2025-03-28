
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';
import { v4 as uuidv4 } from 'uuid';

interface WebSocketHandlers {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: string) => void;
  onTextMessage?: (text: string) => void;
  onAudioChunk?: (audioChunk: ArrayBuffer) => void;
  onComplete?: () => void;
}

export function useGeminiWebSocket({
  onOpen,
  onClose,
  onError,
  onTextMessage,
  onAudioChunk,
  onComplete
}: WebSocketHandlers = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const pingIntervalRef = useRef<number | null>(null);
  const clientIdRef = useRef(uuidv4());

  // Connect to the WebSocket server
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const wsBaseUrl = API_CONFIG.WS_BASE_URL;
      const path = `${API_CONFIG.WEBSOCKET.DEFAULT_PATH}/${clientIdRef.current}`;
      const wsUrl = `${wsBaseUrl}${path}`;
      console.log(`Connecting to WebSocket at ${wsUrl}`);

      wsRef.current = new WebSocket(wsUrl);

      // Set up event handlers
      wsRef.current.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        
        // Set up ping interval
        if (pingIntervalRef.current) {
          window.clearInterval(pingIntervalRef.current);
        }
        
        pingIntervalRef.current = window.setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log('Sending ping to keep connection alive');
            wsRef.current.send(JSON.stringify(API_CONFIG.WEBSOCKET.PING_MESSAGE));
          }
        }, API_CONFIG.WEBSOCKET.PING_INTERVAL); // Use the correct config property
        
        if (onOpen) onOpen();
      };

      wsRef.current.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          window.clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        // Attempt to reconnect if not closed cleanly
        if (event.code !== 1000 && event.code !== 1001) {
          if (reconnectAttemptsRef.current < API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS) {
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current + 1}/${API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS})`);
            reconnectAttemptsRef.current++;
            setTimeout(() => connect(), API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL);
          } else {
            setError(`Connection closed after ${API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS} reconnect attempts`);
            setIsConnecting(false);
          }
        } else {
          setIsConnecting(false);
        }
        
        if (onClose) onClose(event);
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Error connecting to AI service');
        if (onError) onError('WebSocket connection error');
      };

      wsRef.current.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const jsonData = JSON.parse(event.data);
            
            // Handle different message types
            if (jsonData.type === 'text') {
              if (onTextMessage) onTextMessage(jsonData.content);
            } else if (jsonData.type === 'complete') {
              if (onComplete) onComplete();
            } else if (jsonData.type === 'error') {
              const errorMessage = jsonData.error || 'Unknown error occurred';
              setError(errorMessage);
              if (onError) onError(errorMessage);
            } else if (jsonData.type === 'pong') {
              // Received pong response
              console.log('Received pong from server');
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        } else if (event.data instanceof Blob && onAudioChunk) {
          // Handle binary data (audio chunks)
          event.data.arrayBuffer().then(buffer => {
            if (onAudioChunk) onAudioChunk(buffer);
          });
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setError(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnecting(false);
      if (onError) onError(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [onOpen, onClose, onError, onTextMessage, onAudioChunk, onComplete]);

  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnected');
      wsRef.current = null;
    }
    
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  // Send a message to the server
  const sendMessage = useCallback((text: string, enableTTS: boolean = false) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      const errorMsg = 'WebSocket not connected';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }
    
    const message = {
      text,
      enableTTS,
      role: 'user'
    };
    
    wsRef.current.send(JSON.stringify(message));
  }, [onError]);

  // Clean up the WebSocket connection when the component unmounts
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
      
      if (pingIntervalRef.current) {
        window.clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage
  };
}
