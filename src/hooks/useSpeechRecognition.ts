
import { useState, useRef, useEffect } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types/voice';

export const useSpeechRecognition = (onCommand: (command: string) => void = () => {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          
          // Check if the result is final
          if (event.results[0].isFinal) {
            onCommand(transcript);
            // Reset the transcript
            setTranscript('');
            // Auto-stop after getting a final result
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              setIsListening(false);
            }
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.log('Speech recognition not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Reset transcript when starting new recording
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return {
    isListening,
    transcript,
    toggleListening
  };
};
