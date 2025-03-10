import { useState, useEffect } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import debounce from 'lodash/debounce';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const debouncedProcessing = debounce((command: string) => {
    setValue(command);
    if (command.trim()) {
      onSend();
    }
  }, 300);
  
  const handleCommand = async (command: string) => {
    setAiProcessing(true);
    try {
      await debouncedProcessing(command);
    } finally {
      // Add a small delay before setting aiProcessing to false
      setTimeout(() => {
        setAiProcessing(false);
      }, 300);
    }
  };
  
  const { 
    isListening, 
    transcript, 
    toggleListening,
    voiceError 
  } = useSpeechRecognition(handleCommand);

  // Add animation state management with delay to prevent flickering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isListening) {
      // Set transcribing state immediately when starting to listen
      setIsTranscribing(true);
    } else {
      // When stopping listening, delay turning off the UI to allow for animations
      // and prevent flickering with short recognition attempts
      timer = setTimeout(() => {
        setIsTranscribing(false);
      }, 1000); // Increased from 800ms to 1000ms for smoother transitions
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
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
