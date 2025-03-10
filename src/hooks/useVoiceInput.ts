
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import debounce from 'lodash/debounce';

export function useVoiceInput(setValue: (value: string) => void, onSend: () => void) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const processingRef = useRef(false);
  
  // Improved debounce implementation that won't get recreated on renders
  const debouncedProcessingRef = useRef<ReturnType<typeof debounce>>();
  
  // Create debounced function only once
  useEffect(() => {
    debouncedProcessingRef.current = debounce((command: string) => {
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
    }, 700); // Increased debounce delay for better performance
    
    // Cleanup debounce on unmount
    return () => {
      debouncedProcessingRef.current?.cancel();
    };
  }, [setValue, onSend]);
  
  // Memoize handleCommand to prevent unnecessary recreations
  const handleCommand = useCallback(async (command: string) => {
    setAiProcessing(true);
    
    try {
      // Execute the debounced processing
      debouncedProcessingRef.current?.(command);
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
      // Cancel any pending debounced operations when stopping listening
      debouncedProcessingRef.current?.cancel();
      
      // Increased delay when stopping to allow for smoother animations
      transcribingTimer = setTimeout(() => {
        setIsTranscribing(false);
      }, 1500); // Increased for smoother exit
    }
    
    // Cleanup function to handle component unmount and state changes
    return () => {
      if (transcribingTimer) {
        clearTimeout(transcribingTimer);
      }
    };
  }, [isListening]);

  // Extra cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedProcessingRef.current?.cancel();
    };
  }, []);

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isTranscribing
  };
}
