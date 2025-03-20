
import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types/voice';

interface UseVoiceRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  language?: string;
  autoStart?: boolean;
}

export function useVoiceRecognition({
  onResult,
  onFinalResult,
  onError,
  continuous = true,
  language = 'en-US',
  autoStart = false,
}: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  // Create reference to recognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
      return;
    }
    
    setIsSupported(true);
    
    // Initialize
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    
    if (recognition) {
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      
      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        const transcriptValue = lastResult[0].transcript;
        
        setTranscript(transcriptValue);
        
        if (onResult) {
          onResult(transcriptValue, lastResult.isFinal);
        }
        
        if (lastResult.isFinal && onFinalResult) {
          onFinalResult(transcriptValue);
        }
      };
      
      // Handle errors
      recognition.onerror = (event: Event) => {
        const errorMessage = (event as any).error || 'Unknown speech recognition error';
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }
      };
      
      // Handle end of recognition
      recognition.onend = () => {
        if (isListening) {
          // If still supposed to be listening, restart
          try {
            recognition.start();
          } catch (err) {
            console.error('Error restarting speech recognition:', err);
            setIsListening(false);
          }
        }
      };
    }
    
    // Auto-start if configured
    if (autoStart) {
      startListening();
    }
    
    // Cleanup on unmount
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuous, language]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setError(null);
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error starting speech recognition';
      setError(message);
      setIsListening(false);
      
      if (onError) {
        onError(message);
      }
    }
  }, [onError]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
    
    setIsListening(false);
  }, []);
  
  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript: () => setTranscript('')
  };
}
