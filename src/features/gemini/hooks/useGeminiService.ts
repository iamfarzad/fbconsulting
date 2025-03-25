import { useState, useCallback } from 'react';
import { useGeminiWebSocket } from './useGeminiWebSocket';
import { useGeminiAudioPlayback } from './useGeminiAudioPlayback';
import { useToast } from '@/hooks/use-toast';
import { AudioMessage, DEFAULT_AUDIO_CONFIG } from '@/types/audio';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseGeminiServiceProps {
  onError?: (error: string) => void;
  onMessageStart?: () => void;
  onMessageComplete?: () => void;
}

/**
 * Hook for managing Gemini chat service with audio support
 */
export function useGeminiService({
  onError,
  onMessageStart,
  onMessageComplete
}: UseGeminiServiceProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    handleAudioChunk,
    handleAudioMetadata,
    error: audioError,
    progress: audioProgress,
    isPlaying: isAudioPlaying,
    stopAudio,
    playAudioChunks,
    clearAudio
  } = useGeminiAudioPlayback({
    onPlaybackError: (error) => {
      toast({
        title: "Audio Error",
        description: error,
        variant: "destructive"
      });
    }
  });

  const handleMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: text,
      timestamp: Date.now()
    }]);
  }, []);

  const handleError = useCallback((error: string) => {
    setError(error);
    if (onError) onError(error);
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    });
  }, [onError, toast]);

  const {
    isConnected,
    isConnecting,
    error: wsError,
    sendMessage: sendWebSocketMessage,
    connect,
    disconnect
  } = useGeminiWebSocket({
    onTextMessage: handleMessage,
    onError: handleError,
    onAudioChunk: handleAudioChunk,
    onComplete: () => {
      setIsLoading(false);
      if (onMessageComplete) onMessageComplete();
    }
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      if (onMessageStart) onMessageStart();

      // Add user message to history
      setMessages(prev => [...prev, {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now()
      }]);

      // Send message through WebSocket
      sendWebSocketMessage(content, true); // true enables TTS

    } catch (error) {
      console.error('Error sending message:', error);
      handleError(error instanceof Error ? error.message : 'Failed to send message');
    }
  }, [sendWebSocketMessage, handleError, onMessageStart]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    clearAudio();
  }, [clearAudio]);

  return {
    // Chat state
    messages,
    isLoading,
    error: error || wsError || audioError,
    
    // Connection state
    isConnected,
    isConnecting,
    
    // Audio state and controls
    isPlaying: isAudioPlaying,
    progress: audioProgress,
    stopAudio,
    playAudioChunks,
    clearAudio,
    
    // Actions
    sendMessage,
    clearMessages,
    connect,
    disconnect
  };
}

export default useGeminiService;
