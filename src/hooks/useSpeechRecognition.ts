
import { useState, useCallback, useEffect } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  autoStopAfterSilence?: number;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(
  onResult?: (transcript: string) => void,
  options: UseSpeechRecognitionOptions = {}
) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' && 'SpeechRecognition' in window || 
                     'webkitSpeechRecognition' in window;
  
  // Fallback message if not supported
  if (!isSupported) {
    console.warn('Speech recognition is not supported in this browser.');
  }
  
  // Setup speech recognition
  const startListening = useCallback(() => {
    if (!isSupported) {
      setVoiceError('Speech recognition is not supported in this browser.');
      return;
    }
    
    try {
      // Clear previous errors
      setVoiceError(null);
      
      // Get SpeechRecognition constructor
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure recognition
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? true;
      recognition.lang = options.lang ?? 'en-US';
      
      // Handle results
      recognition.onresult = (event) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        
        setTranscript(transcript);
        console.log('Speech recognized:', transcript);
      };
      
      // Handle end event
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // If we have a transcript and an onResult callback, call it
        if (transcript && onResult) {
          onResult(transcript);
          setTranscript('');
        }
      };
      
      // Handle errors
      recognition.onerror = (event) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        console.error(errorMessage);
        setVoiceError(errorMessage);
        setIsListening(false);
        
        if (options.onError) {
          options.onError(errorMessage);
        }
      };
      
      // Start recognition
      recognition.start();
      setIsListening(true);
      
      // Auto-stop after silence if specified
      if (options.autoStopAfterSilence) {
        setTimeout(() => {
          if (recognition) {
            recognition.stop();
          }
        }, options.autoStopAfterSilence);
      }
      
      // Store recognition instance
      // @ts-ignore - we're adding a property to window
      window.recognition = recognition;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown speech recognition error';
      console.error(errorMessage);
      setVoiceError(errorMessage);
      setIsListening(false);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
    }
  }, [isSupported, onResult, options, transcript]);
  
  // Stop listening function
  const stopListening = useCallback(() => {
    try {
      // @ts-ignore - we know we added this property
      if (window.recognition) {
        // @ts-ignore
        window.recognition.stop();
        // @ts-ignore
        window.recognition = null;
      }
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, []);
  
  // Toggle listening function
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);
  
  return {
    isListening,
    transcript,
    voiceError,
    isSupported,
    startListening,
    stopListening,
    toggleListening
  };
}

// Add this to enable TypeScript to recognize the global SpeechRecognition types
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
    recognition?: any;
  }
}
