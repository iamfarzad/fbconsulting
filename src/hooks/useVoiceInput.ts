
import { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import debounce from 'lodash/debounce';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Increased debounce delay and memoized with useCallback
  const debouncedProcessing = useCallback(
    debounce((command: string) => {
      setValue(command);
      if (command.trim()) {
        onSend();
      }
    }, 500), // Increased from 300ms to 500ms for better debouncing
    [setValue, onSend]
  );
  
  // Memoize handleCommand to prevent unnecessary recreations
  const handleCommand = useCallback(async (command: string) => {
    setAiProcessing(true);
    try {
      await debouncedProcessing(command);
    } finally {
      // Increased delay before setting aiProcessing to false for smoother transitions
      setTimeout(() => {
        setAiProcessing(false);
      }, 600); // Increased from 300ms to 600ms for smoother state transition
    }
  }, [debouncedProcessing]);
  
  const { 
    isListening, 
    transcript, 
    toggleListening,
    voiceError 
  } = useSpeechRecognition(handleCommand);

  // Enhanced animation state management with increased durations
  useEffect(() => {
    let transcribingTimer: NodeJS.Timeout;
    
    if (isListening) {
      // Add a small delay before showing transcribing state to prevent flashing
      transcribingTimer = setTimeout(() => {
        setIsTranscribing(true);
      }, 150); // Small delay for smoother start
    } else {
      // Increased delay when stopping to allow for smoother animations
      transcribingTimer = setTimeout(() => {
        setIsTranscribing(false);
      }, 1500); // Increased from 1000ms to 1500ms for smoother exit
    }
    
    // Cleanup function to handle component unmount and state changes
    return () => {
      if (transcribingTimer) {
        clearTimeout(transcribingTimer);
      }
      // Cancel any pending debounced operations
      debouncedProcessing.cancel();
    };
  }, [isListening, debouncedProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedProcessing.cancel();
    };
  }, [debouncedProcessing]);

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isTranscribing
  };
}
