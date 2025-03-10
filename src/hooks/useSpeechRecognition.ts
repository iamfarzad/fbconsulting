
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
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setTranscript(transcript);
          
          if (transcript.includes('show me your work') || transcript.includes('portfolio')) {
            onCommand('portfolio');
          } else if (transcript.includes('tell me more') || transcript.includes('about')) {
            onCommand('about');
          } else if (transcript.includes('contact') || transcript.includes('get in touch')) {
            onCommand('contact');
          } else if (transcript.includes('services')) {
            onCommand('services');
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
