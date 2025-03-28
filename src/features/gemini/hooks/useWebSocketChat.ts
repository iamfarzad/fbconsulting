
import { useState, useCallback, useEffect } from 'react';
import { useWebSocketClient } from './useWebSocketClient';
import { useAudioHandler } from './useAudioHandler';
import { AIMessage } from '../types/messageTypes';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useWebSocketChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set up audio playback
  const {
    handleAudioChunk,
    isPlaying: isAudioPlaying,
    progress: audioProgress,
    stopAudio,
    clearAudio,
    error: audioError
  } = useAudioHandler({
    autoPlay: true,
    onPlaybackError: (error) => {
      toast({
        title: "Audio Error",
        description: error,
        variant: "destructive"
      });
    }
  });

  // Set up WebSocket client
  const {
    connect,
    disconnect,
    sendMessage: sendTextMessage,
    isConnected,
    isConnecting,
    error: wsError,
    clientId
  } = useWebSocketClient({
    debug: true,
    onMessage: (message) => {
      if (message.type === 'text' && message.content) {
        // Add assistant message
        addMessage('assistant', message.content);
        
        // Mark as no longer loading if we receive text
        setIsLoading(false);
      } else if (message.type === 'complete') {
        // Handle completion message
        setIsLoading(false);
      } else if (message.type === 'error' && message.error) {
        // Handle error message
        setIsLoading(false);
        toast({
          title: "Error",
          description: message.error,
          variant: "destructive"
        });
      }
    },
    onAudioChunk: handleAudioChunk,
    onOpen: () => {
      toast({
        title: "Connected",
        description: "Connected to AI service",
      });
    },
    onClose: () => {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  });

  // Add a message to the chat
  const addMessage = useCallback((role: 'user' | 'assistant' | 'system' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now(),
      id: uuidv4() // Generate a unique ID for the message
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please wait until the connection is established",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Add user message to chat
      addMessage('user', content);
      
      // Send message through WebSocket
      sendTextMessage({
        type: 'text_message',
        text: content,
        enableTTS: true
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [isConnected, sendTextMessage, addMessage, toast]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    clearAudio();
  }, [clearAudio]);

  // Connect on mount if auto-connect is enabled
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    // State
    messages,
    isLoading,
    isConnected,
    isConnecting,
    isAudioPlaying,
    audioProgress,
    error: wsError || audioError,
    clientId,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    stopAudio
  };
}

export default useWebSocketChat;
