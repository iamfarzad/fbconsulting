
import { useState, useCallback, useEffect, useRef } from 'react';
import { useWebSocketClient } from './useWebSocketClient';
import { useGeminiAudioPlayback } from './useGeminiAudioPlayback';
import { v4 as uuidv4 } from 'uuid';
import { API_CONFIG } from '@/config/api';

export interface AIMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp?: number;
}

export function useWebSocketChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageIdCounterRef = useRef(0);
  const [offlineMode, setOfflineMode] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = API_CONFIG.DEFAULT_RECONNECT_ATTEMPTS || 3;
  
  // Use audio playback hook
  const {
    isPlaying: isAudioPlaying,
    progress: audioProgress,
    error: audioError,
    handleAudioChunk,
    stopAudio,
    clearAudio
  } = useGeminiAudioPlayback({
    onPlaybackError: (error) => {
      console.error('Audio playback error:', error);
    }
  });
  
  // Handle WebSocket messages
  const handleMessage = useCallback((data: any) => {
    if (data.type === 'text') {
      // Text message from the assistant
      setMessages(prev => {
        // Check if we already have an assistant message we should update
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.id) {
          // Update the last message
          return [
            ...prev.slice(0, prev.length - 1),
            { ...lastMessage, content: data.content }
          ];
        } else {
          // Add a new message
          return [
            ...prev,
            {
              role: 'assistant',
              content: data.content,
              timestamp: Date.now()
            }
          ];
        }
      });
      
      setIsLoading(false);
    } else if (data.type === 'complete') {
      // Message completion signal
      setIsLoading(false);
      
      // Ensure the last message has the complete text
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          return [
            ...prev.slice(0, prev.length - 1),
            { 
              ...lastMessage, 
              content: data.text || lastMessage.content,
              id: `ai-${messageIdCounterRef.current++}`
            }
          ];
        }
        return prev;
      });
    } else if (data.type === 'error') {
      console.error('WebSocket error message:', data.error);
      
      // Add error message if appropriate
      if (data.error && !offlineMode) {
        setMessages(prev => [
          ...prev,
          {
            role: 'error',
            content: `Error: ${data.error}`,
            id: `error-${messageIdCounterRef.current++}`,
            timestamp: Date.now()
          }
        ]);
      }
      
      setIsLoading(false);
    }
  }, [offlineMode]);
  
  // Use WebSocket client
  const {
    isConnected,
    isConnecting,
    error: wsError,
    clientId,
    connect,
    disconnect,
    sendMessage: wsSendMessage
  } = useWebSocketClient({
    onOpen: () => {
      console.log('WebSocket connected');
      setOfflineMode(false);
      reconnectAttemptsRef.current = 0;
    },
    onMessage: handleMessage,
    onError: (error) => {
      console.error('WebSocket error:', error);
      reconnectAttemptsRef.current += 1;
      
      // Switch to offline mode after max reconnect attempts
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setOfflineMode(true);
        console.log('Switching to offline mode after failed reconnect attempts');
      }
    },
    onClose: () => {
      console.log('WebSocket closed');
    },
    onAudioChunk: handleAudioChunk,
    autoReconnect: true,
    suppressErrors: offlineMode
  });
  
  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  // Send a message via WebSocket
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    const messageId = `user-${messageIdCounterRef.current++}`;
    
    // Add user message to state
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content,
        id: messageId,
        timestamp: Date.now()
      }
    ]);
    
    // In offline mode, generate a mock response
    if (offlineMode) {
      setIsLoading(true);
      
      setTimeout(() => {
        const mockResponses = [
          "I'm currently offline. Your message has been saved and I'll respond when connection is restored.",
          "Sorry, I can't connect to the AI service right now. Please try again later.",
          "It seems we're having connectivity issues. I've noted your message and will get back to you soon."
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: randomResponse,
            id: `ai-${messageIdCounterRef.current++}`,
            timestamp: Date.now()
          }
        ]);
        
        setIsLoading(false);
      }, 1000);
      
      return;
    }
    
    // Send via WebSocket if connected
    if (isConnected) {
      setIsLoading(true);
      
      wsSendMessage({
        type: 'text_message',
        text: content,
        enableTTS: true
      });
    } else {
      console.error('Cannot send message: WebSocket not connected');
      
      // If not connected and not in offline mode, try to reconnect
      if (!offlineMode) {
        connect();
        
        // Queue the message to be sent when connected
        setTimeout(() => {
          if (isConnected) {
            setIsLoading(true);
            
            wsSendMessage({
              type: 'text_message',
              text: content,
              enableTTS: true
            });
          } else {
            // Switch to offline mode with a message
            setOfflineMode(true);
            
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: "I'm having trouble connecting to the server. I'll be working in offline mode with limited responses.",
                id: `ai-${messageIdCounterRef.current++}`,
                timestamp: Date.now()
              }
            ]);
          }
        }, 2000);
      }
    }
  }, [isConnected, wsSendMessage, connect, offlineMode]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    clearAudio();
  }, [clearAudio]);
  
  return {
    messages,
    isLoading,
    isConnected,
    isConnecting,
    isAudioPlaying,
    audioProgress,
    error: wsError || audioError,
    clientId,
    offlineMode,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    stopAudio
  };
}
