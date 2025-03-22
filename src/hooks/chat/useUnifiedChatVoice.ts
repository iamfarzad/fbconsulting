
import { useCallback } from 'react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface UseUnifiedChatVoiceOptions {
  setInputValue: (value: string) => void;
  handleSend: () => void;
}

export function useUnifiedChatVoice({ setInputValue, handleSend }: UseUnifiedChatVoiceOptions) {
  // Setup voice input handling
  const handleVoiceCommand = useCallback((command: string) => {
    if (command.trim()) {
      setInputValue(command);
      setTimeout(() => {
        handleSend();
      }, 300);
    }
  }, [setInputValue, handleSend]);
  
  // Voice input integration
  const {
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError
  } = useVoiceInput(
    setInputValue,
    handleSend
  );

  return {
    isListening,
    transcript,
    toggleListening,
    isTranscribing, 
    voiceError,
    handleVoiceCommand
  };
}
