
import { useState } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  
  const handleCommand = async (command: string) => {
    setAiProcessing(true);
    try {
      setValue(command);
      
      // Auto-send if we have a complete command
      if (command.trim()) {
        await onSend();
      }
    } finally {
      setAiProcessing(false);
    }
  };
  
  const { 
    isListening, 
    transcript, 
    toggleListening,
    voiceError 
  } = useSpeechRecognition(handleCommand);

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing
  };
}
