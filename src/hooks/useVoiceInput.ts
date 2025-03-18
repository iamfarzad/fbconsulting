
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import debounce from 'lodash/debounce';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const processingRef = useRef(false);
  
  // Create debounced function only once
  const debouncedProcessingRef = useRef(
    debounce((command: string) => {
      if (processingRef.current) return;
      
      processingRef.current = true;
      setValue(command);
      
      // Only send if there's content
      if (command.trim()) {
        onSend();
      }
      
      // Reset processing flag after a delay
      setTimeout(() => {
        processingRef.current = false;
        setAiProcessing(false);
      }, 800); // Longer delay for smoother transitions
    }, 700)
  );
  
  // Memoize handleCommand to prevent unnecessary recreations
  const handleCommand = useCallback(async (command: string) => {
    console.log('Voice command received:', command);
    setAiProcessing(true);
    
    try {
      // Execute the debounced processing
      debouncedProcessingRef.current(command);
    } catch (error) {
      console.error('Error processing voice command:', error);
      setAiProcessing(false);
      processingRef.current = false;
    }
  }, []);
  
  const { 
    isListening, 
    transcript, 
    toggleListening,
    voiceError,
    isVoiceSupported 
  } = useSpeechRecognition(handleCommand);

  // Enhanced animation state management with increased durations
  useEffect(() => {
    let transcribingTimer: NodeJS.Timeout;
    
    if (isListening) {
      console.log('Voice listening started, showing transcription UI');
      // Add a small delay before showing transcribing state to prevent flashing
      transcribingTimer = setTimeout(() => {
        setIsTranscribing(true);
      }, 150); // Small delay for smoother start
    } else {
      console.log('Voice listening ended, hiding transcription UI');
      // Cancel any pending debounced operations when stopping listening
      debouncedProcessingRef.current.cancel();
      
      // Increased delay when stopping to allow for smoother animations
      transcribingTimer = setTimeout(() => {
        setIsTranscribing(false);
      }, 1000); // Increased for smoother exit
    }
    
    return () => {
      if (transcribingTimer) {
        clearTimeout(transcribingTimer);
      }
    };
  }, [isListening]);

  // Extra cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedProcessingRef.current.cancel();
    };
  }, []);

  // Log whenever voice error changes
  useEffect(() => {
    if (voiceError) {
      console.error('Voice input error:', voiceError);
    }
  }, [voiceError]);

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isTranscribing,
    isVoiceSupported
  };
}
