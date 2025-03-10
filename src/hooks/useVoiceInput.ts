
import { useState, useEffect } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
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

  // Add animation state management
  useEffect(() => {
    if (isListening) {
      setIsTranscribing(true);
    } else {
      // Delay setting isTranscribing to false to allow for exit animation
      const timer = setTimeout(() => {
        setIsTranscribing(false);
      }, 500); // Match this with animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isTranscribing
  };
}
