
import { useState, useRef, useEffect, useCallback } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types/voice';
import { useToast } from './use-toast';

export const useSpeechRecognition = (onCommand: (command: string) => void = () => {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    const checkSpeechSupport = () => {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionConstructor) {
          recognitionRef.current = new SpeechRecognitionConstructor();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US'; // Set default language
          
          // Configure event handlers
          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            if (event.results.length > 0) {
              const transcript = event.results[0][0].transcript;
              setTranscript(transcript);
              setVoiceError(null);
              
              // Check if the result is final
              if (event.results[0].isFinal) {
                console.log('Final voice transcript:', transcript);
                onCommand(transcript);
                // Reset the transcript
                setTranscript('');
                // Auto-stop after getting a final result
                if (recognitionRef.current) {
                  recognitionRef.current.stop();
                  setIsListening(false);
                }
              }
            }
          };
          
          recognitionRef.current.onerror = (event: Event) => {
            // Safely convert the event to access potential error properties
            const errorEvent = event as unknown as { error?: string; message?: string };
            let errorMessage = 'Error with voice recognition';
            
            if (errorEvent.error) {
              errorMessage = errorEvent.error;
              
              // Show user-friendly messages for common errors
              if (errorEvent.error === 'not-allowed') {
                errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
                toast({
                  title: "Microphone Error",
                  description: errorMessage,
                  variant: "destructive"
                });
              } else if (errorEvent.error === 'no-speech') {
                errorMessage = 'No speech detected. Please try speaking again.';
              }
            } else if (errorEvent.message) {
              errorMessage = errorEvent.message;
            }
            
            console.error('Speech recognition error:', errorMessage);
            setVoiceError(errorMessage);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };
          
          setIsSupported(true);
        } else {
          setIsSupported(false);
          setVoiceError('Speech recognition constructor not available');
        }
      } else {
        console.error('Speech recognition not supported in this browser');
        setIsSupported(false);
        setVoiceError('Speech recognition not supported in this browser');
        toast({
          title: "Browser Incompatible",
          description: "Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.",
          variant: "destructive"
        });
      }
    };
    
    checkSpeechSupport();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onCommand, toast]);

  // Start listening function with improved reliability
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition not initialized or not supported in this browser');
      return;
    }
    
    try {
      console.log('Requesting microphone permission');
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Reset states
      setVoiceError(null);
      setTranscript('');
      // Start recognition
      console.log('Starting speech recognition');
      recognitionRef.current.start();
      setIsListening(true);
      
      // Show toast notification that we're listening
      toast({
        title: "Listening...",
        description: "Speak now. Your voice will be converted to text.",
      });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setVoiceError('Microphone permission denied');
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }
    
    console.log('Stopping speech recognition');
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Toggle listening function
  const toggleListening = useCallback(async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    toggleListening,
    startListening,
    stopListening,
    resetTranscript,
    voiceError,
    isVoiceSupported: isSupported
  };
};
