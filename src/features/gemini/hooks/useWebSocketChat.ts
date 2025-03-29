
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage } from '@/types/chat';
import { API_CONFIG } from '@/config/api';
import { useGeminiAudioPlayback } from './useGeminiAudioPlayback';

/**
 * Hook for WebSocket chat with Gemini
 */
export function useWebSocketChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState(() => uuidv4());
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // Audio playback handling
  const {
    isPlaying: isAudioPlaying,
    progress: audioProgress,
    handleAudioChunk,
    stopAudio,
    clearAudio
  } = useGeminiAudioPlayback({
    onPlaybackError: (err) => console.error('Audio playback error:', err)
  });
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    // Don't connect if already connecting or connected
    if (isConnecting || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const wsUrl = `${API_CONFIG.WS_BASE_URL}/ws/${clientId}`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle text messages
          if (data.type === 'text' && data.content) {
            const assistantMessage: AIMessage = {
              role: 'assistant',
              content: data.content,
              timestamp: Date.now()
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
          }
          
          // Handle audio chunks for TTS
          if (data.type === 'audio_chunk' && data.data) {
            // Convert base64 to ArrayBuffer 
            const binaryString = atob(data.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            handleAudioChunk(bytes.buffer);
          }
          
          // Handle errors
          if (data.type === 'error') {
            const errorMessage = data.error || 'Unknown error';
            console.error('WebSocket error message:', errorMessage);
            setError(errorMessage);
            setIsLoading(false);
            
            // Add error message to chat
            const errorMsg: AIMessage = {
              role: 'error',
              content: `Error: ${errorMessage}`,
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
          }
          
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
      
      ws.onerror = () => {
        console.error('WebSocket error');
        setIsConnected(false);
        setIsConnecting(false);
        setError('Connection error. Please try again.');
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsConnecting(false);
        
        // Attempt to reconnect if not at max attempts
        if (reconnectAttemptsRef.current < API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          console.log(`Attempting reconnect ${reconnectAttemptsRef.current}/${API_CONFIG.WEBSOCKET.RECONNECT_ATTEMPTS}`);
          
          // Exponential backoff
          const delay = API_CONFIG.WEBSOCKET.RECONNECT_INTERVAL * Math.pow(2, reconnectAttemptsRef.current - 1);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, delay);
        } else if (!error) {
          setError('Failed to connect after multiple attempts. Try again later.');
        }
      };
      
      wsRef.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
    }
  }, [clientId, isConnecting, isConnected, error, handleAudioChunk]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);
  
  // Send message through WebSocket
  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // Attempt to reconnect
      connect();
      setError('Connection lost. Attempting to reconnect...');
      return;
    }
    
    try {
      // Create and add user message
      const userMessage: AIMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Send message with TTS enabled
      const message = {
        text: content.trim(),
        role: 'user',
        enableTTS: true
      };
      
      wsRef.current.send(JSON.stringify(message));
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  }, [connect]);
  
  // Clear chat messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    // Also stop any audio playback
    stopAudio();
  }, [stopAudio]);
  
  // Initialize connection on mount
  useEffect(() => {
    connect();
    
    // Set up ping interval
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (e) {
          console.error('Error sending ping:', e);
        }
      }
    }, API_CONFIG.WEBSOCKET.PING_INTERVAL);
    
    // Cleanup on unmount
    return () => {
      clearInterval(pingInterval);
      disconnect();
      clearAudio();
    };
  }, [connect, disconnect, clearAudio]);
  
  return {
    messages,
    isLoading,
    isConnected,
    isConnecting,
    isAudioPlaying,
    audioProgress,
    error,
    clientId,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    stopAudio
  };
}

export default useWebSocketChat;
