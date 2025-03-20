
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceInputOptions {
  onTranscriptChange?: (transcript: string) => void;
  onTranscriptComplete?: (finalTranscript: string) => void;
  autoStop?: boolean;
  stopAfterSeconds?: number;
  language?: string;
  continuousListening?: boolean;
}

export const useVoiceInput = (
  onTranscriptChange?: (transcript: string) => void,
  onTranscriptComplete?: (finalTranscript: string) => void,
  options: UseVoiceInputOptions = {}
) => {
  const {
    autoStop = true,
    stopAfterSeconds = 10,
    language = 'en-US',
    continuousListening = false
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize speech recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check browser support
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsVoiceSupported(true);
      } else {
        setIsVoiceSupported(false);
        console.log('Speech recognition is not supported in this browser');
      }
    }
    
    return () => {
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Stop recognition on unmount if active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping speech recognition on unmount:', error);
        }
      }
    };
  }, []);
  
  // Function to update transcript
  const updateTranscript = useCallback((newTranscript: string) => {
    setTranscript(newTranscript);
    
    if (onTranscriptChange) {
      onTranscriptChange(newTranscript);
    }
  }, [onTranscriptChange]);
  
  // Function to finalize transcript
  const finalizeTranscript = useCallback((finalTranscript: string) => {
    if (onTranscriptComplete && finalTranscript.trim()) {
      onTranscriptComplete(finalTranscript);
    }
    
    if (!continuousListening) {
      setTranscript('');
    }
  }, [onTranscriptComplete, continuousListening]);
  
  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
          setVoiceError('Error stopping the voice input. Please try again.');
        }
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // Start listening
      try {
        // Reset state
        setVoiceError(null);
        setIsTranscribing(true);
        
        // Create new recognition instance
        const SpeechRecognition = 
          window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported');
        }
        
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        // Configure recognition
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        
        let finalTranscriptValue = '';
        
        // Set up event handlers
        recognition.onstart = () => {
          setIsListening(true);
          updateTranscript('');
        };
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
              finalTranscriptValue += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Update state with combined transcript
          const combinedTranscript = finalTranscriptValue + interimTranscript;
          updateTranscript(combinedTranscript.trim());
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          
          let errorMessage: string;
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access was denied. Please allow microphone access.';
              break;
            case 'no-speech':
              errorMessage = 'No speech was detected. Please try again.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your connection.';
              break;
            default:
              errorMessage = `Error with voice input: ${event.error}`;
          }
          
          setVoiceError(errorMessage);
          setIsListening(false);
          setIsTranscribing(false);
        };
        
        recognition.onend = () => {
          if (finalTranscriptValue.trim()) {
            finalizeTranscript(finalTranscriptValue.trim());
          }
          
          setIsListening(false);
          setIsTranscribing(false);
          recognitionRef.current = null;
          
          // If continuous listening is enabled, restart
          if (continuousListening && !voiceError) {
            toggleListening();
          }
        };
        
        // Start recognition
        recognition.start();
        
        // Set up auto-stop if configured
        if (autoStop && stopAfterSeconds > 0) {
          timeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, stopAfterSeconds * 1000);
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setVoiceError(
          error instanceof Error
            ? error.message
            : 'Failed to start voice input. Please try again.'
        );
        setIsListening(false);
        setIsTranscribing(false);
      }
    }
  }, [
    isListening,
    language,
    autoStop,
    stopAfterSeconds,
    continuousListening,
    updateTranscript,
    finalizeTranscript,
    voiceError
  ]);
  
  return {
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError,
    aiProcessing,
    setAiProcessing,
    isVoiceSupported
  };
};

// Add necessary type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}
