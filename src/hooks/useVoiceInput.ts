
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
      }, 800); // Increased from 500ms to 800ms for smoother transitions
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
