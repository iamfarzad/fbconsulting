
import { useState, useRef, useEffect } from 'react';
import useGeminiChat from './useGeminiChat';
import { useGemini } from '@/components/copilot/GeminiProvider';
import { useVoiceInput } from './useVoiceInput';

export const useGeminiChatHandler = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { personaData, isInitialized, isLoading: isProviderLoading, error: providerError } = useGemini();
  const { messages, isLoading, error, sendMessage, clearMessages } = useGeminiChat({ personaData });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice input integration
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useVoiceInput(setInputValue, () => {
    if (transcript.trim()) {
      handleSendMessage();
    }
  });
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Default persona name if not available
  const currentPersonaName = personaData?.personaDefinitions[personaData?.currentPersona]?.name || "AI Assistant";
  
  return {
    inputValue,
    setInputValue,
    messages,
    isLoading,
    isProviderLoading,
    isInitialized,
    isListening,
    transcript,
    handleSendMessage,
    handleKeyDown,
    toggleListening,
    clearMessages,
    messagesEndRef,
    currentPersonaName,
    error,
    providerError,
    voiceError,
    isVoiceSupported
  };
};
