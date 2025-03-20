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
      console.log('Checking speech recognition support...');
      try {
        // Check if browser supports speech recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          console.log('Speech recognition API available');
          const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
          
          if (SpeechRecognitionConstructor) {
            // Create new instance
            recognitionRef.current = new SpeechRecognitionConstructor();
            
            console.log('Speech recognition instance created');
            
            // Configure speech recognition parameters
            recognitionRef.current.continuous = false; 
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US'; 
            recognitionRef.current.maxAlternatives = 1;
          
            // Configure event handlers
            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
              if (event.results.length > 0) {
                const transcript = event.results[0][0].transcript;
                setTranscript(transcript);
                setVoiceError(null);
                
                // Check if the result is final
                if (event.results[0].isFinal) {
                  console.log('Final voice transcript:', transcript);
                  // Stop listening before processing command to prevent overlap
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  }
                  onCommand(transcript);
                  // Reset the transcript after command is processed
                  setTranscript('');
                }
              }
            };
            
            recognitionRef.current.onerror = (event: Event) => {
              // Safely convert the event to access potential error properties
              console.log('Speech recognition error event:', event);
              const errorEvent = event as unknown as { error?: string; message?: string };
              let errorMessage = 'Error with voice recognition';
              
              if (errorEvent.error) {
                errorMessage = errorEvent.error;
                console.error('Speech recognition error type:', errorEvent.error);
                
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
                } else if (errorEvent.error === 'aborted') {
                  errorMessage = 'Voice recognition was aborted.';
                } else if (errorEvent.error === 'audio-capture') {
                  errorMessage = 'Unable to capture audio. Please check your microphone.';
                  toast({
                    title: "Microphone Error",
                    description: errorMessage,
                    variant: "destructive"
                  });
                } else if (errorEvent.error === 'network') {
                  errorMessage = 'Network error occurred. Please check your connection.';
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
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSupported(false);
        setVoiceError('Error initializing speech recognition');
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
      toast({
        title: "Speech Recognition Error",
        description: "Speech recognition not initialized or not supported in this browser",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // If already listening, stop first
      if (isListening) {
        stopListening();
        await new Promise(resolve => setTimeout(resolve, 200)); // Slightly longer delay to ensure cleanup
      }
      
      console.log('Requesting microphone permission');
      // Request microphone permission explicitly before starting recognition
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted with stream:', !!stream);
      
      // Reset states
      setVoiceError(null);
      setTranscript('');
      
      // Show toast notification that we're listening (moved before starting to ensure it shows)
      toast({
        title: "Listening...",
        description: "Speak now. Your voice will be converted to text.",
      });
      
      // Start recognition with timeout
      console.log('Starting speech recognition');
      recognitionRef.current.start();
      setIsListening(true);
      
      // Auto-stop after 10 seconds if no final result
      const timeoutId = setTimeout(() => {
        if (isListening && recognitionRef.current) {
          console.log('Auto-stopping after timeout');
          stopListening();
          toast({
            title: "Listening Timed Out",
            description: "No speech detected. Please try again.",
            variant: "default"
          });
        }
      }, 10000);
      
      // Store timeout ID for cleanup
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error with voice recognition:', error);
      setVoiceError(typeof error === 'string' ? error : 'Microphone permission denied');
      setIsListening(false);
      toast({
        title: "Microphone Access Error",
        description: "Please allow microphone access and try again.",
        variant: "destructive"
      });
    }
  }, [isListening, toast]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }
    
    console.log('Stopping speech recognition');
    try {
      // First try to abort (more aggressive stop)
      try {
        recognitionRef.current.abort();
        console.log('Aborted speech recognition');
      } catch (abortError) {
        console.log('Could not abort, falling back to stop:', abortError);
        // Fall back to stop if abort is not available or fails
        recognitionRef.current.stop();
        console.log('Stopped speech recognition');
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      // Force UI state to not listening even if we had an error stopping
    }
    
    // Always update state regardless of possible errors
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
