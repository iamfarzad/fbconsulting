
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseVoiceRecognitionOptions {
  onFinalResult?: (transcript: string) => void;
  continuous?: boolean;
  language?: string;
  autoStop?: boolean;
  stopAfterMs?: number;
}

export const useVoiceRecognition = (options: UseVoiceRecognitionOptions = {}) => {
  const {
    onFinalResult,
    continuous = false,
    language = 'en-US',
    autoStop = true,
    stopAfterMs = 10000
  } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Initialize and check support on mount
  useEffect(() => {
    const checkSpeechSupport = () => {
      const SpeechRecognitionAPI = 
        window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        setIsSupported(true);
        console.log('Speech recognition is supported');
      } else {
        setIsSupported(false);
        console.log('Speech recognition is not supported in this browser');
        setError('Speech recognition not supported in this browser');
      }
    };
    
    checkSpeechSupport();
    
    // Clean up on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping speech recognition on unmount:', e);
        }
      }
    };
  }, []);
  
  // Start listening function
  const startListening = useCallback(async () => {
    if (isListening) return;
    
    try {
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error('Microphone permission denied:', error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
        setError('Microphone access denied');
        return;
      }
      
      // Create speech recognition instance
      const SpeechRecognitionAPI = 
        window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setError('Speech recognition not supported');
        return;
      }
      
      // Setup recognition
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      
      let finalTranscript = '';
      
      // Configure event handlers
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setError(null);
        console.log('Speech recognition started');
        
        // Set auto-stop timer if enabled
        if (autoStop && stopAfterMs > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, stopAfterMs);
        }
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const currentTranscript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += currentTranscript + ' ';
            
            // If we got a final result and have a callback, call it
            if (onFinalResult) {
              onFinalResult(finalTranscript.trim());
            }
            
            // If not continuous, stop after a final result
            if (!continuous) {
              recognition.stop();
            }
          } else {
            interimTranscript += currentTranscript;
          }
        }
        
        // Update the live transcript
        setTranscript((finalTranscript + interimTranscript).trim());
      };
      
      recognition.onerror = (event: any) => {
        const errorMessage = event.error || 'Unknown speech recognition error';
        console.error('Speech recognition error:', errorMessage);
        
        let userMessage = 'Error with voice recognition';
        switch (errorMessage) {
          case 'not-allowed':
            userMessage = 'Microphone access denied';
            break;
          case 'no-speech':
            userMessage = 'No speech detected';
            break;
          case 'network':
            userMessage = 'Network error occurred';
            break;
          default:
            userMessage = `Voice error: ${errorMessage}`;
        }
        
        setError(userMessage);
        toast({
          title: "Voice Recognition Error",
          description: userMessage,
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Clear the recognition instance
        recognitionRef.current = null;
      };
      
      // Store the recognition instance
      recognitionRef.current = recognition;
      
      // Start recognition
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [isListening, continuous, language, autoStop, stopAfterMs, onFinalResult, toast]);
  
  // Stop listening function
  const stopListening = useCallback(() => {
    if (!isListening || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [isListening]);
  
  // Toggle listening function
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
    toggleListening
  };
};
