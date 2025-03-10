
import { useState, useRef, useEffect } from 'react';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types/voice';

export const useSpeechRecognition = (onCommand: (command: string) => void = () => {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
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
          setVoiceError(null);
          
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
        
        recognitionRef.current.onerror = (event: Event) => {
          const error = event as { error: string; message: string };
          setVoiceError(error.message || 'Error with voice recognition');
          setIsListening(false);
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

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setVoiceError('Speech recognition not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        // Reset states
        setVoiceError(null);
        setTranscript('');
        // Start recognition
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        setVoiceError('Microphone permission denied');
      }
    }
  };

  return {
    isListening,
    transcript,
    toggleListening,
    voiceError
  };
};
