import { useState, useCallback, useRef } from 'react';
import type { SpeechRecognition, SpeechRecognitionError, SpeechRecognitionResultCallback } from '@/types/speech';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    setIsListening(prev => !prev);
    if (!isListening) {
      try {
        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = ((event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          stopRecognition();
        }) as SpeechRecognitionResultCallback;

        recognition.onerror = ((event: SpeechRecognitionError) => {
          setError(`Speech recognition error: ${event.error}`);
          stopRecognition();
        });

        recognition.onend = () => {
          stopRecognition();
        };

        recognition.start();
      } catch (err) {
        setError(`Failed to start speech recognition: ${err instanceof Error ? err.message : String(err)}`);
        stopRecognition();
      }
    } else {
      stopRecognition();
    }
  }, [isListening, stopRecognition]);

  return {
    isListening,
    toggleListening,
    transcript,
    error
  };
}
