
import { useState, useRef, useCallback } from 'react';
import { AIMessage, FileAttachment } from '@/services/chat/types';
import { useToast } from '@/hooks/use-toast';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface UseUnifiedChatOptions {
  useCopilotKit?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function useUnifiedChat(options: UseUnifiedChatOptions = {}) {
  const { useCopilotKit = false, apiKey, modelName } = options;
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Voice input integration
  const {
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError
  } = useVoiceInput(
    (value) => setInputValue(value),
    () => handleSend()
  );

  // Toggle fullscreen state
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  // Send message function
  const handleSend = useCallback(async (files?: FileAttachment[]) => {
    if (!inputValue.trim() && (!files || files.length === 0)) return;
    
    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage: AIMessage = {
        role: 'user',
        content: inputValue,
        timestamp: Date.now(),
      };
      
      // Add user message to state
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // In a real implementation, this would call the chat service
      // For now, we'll use a mock response
      setTimeout(() => {
        const botMessage: AIMessage = {
          role: 'assistant',
          content: `This is a response to: ${userMessage.content}`,
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [inputValue, toast]);

  // Clear all messages
  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen,
    setShowMessages,
    // Voice-related properties
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError
  };
}

export default useUnifiedChat;
