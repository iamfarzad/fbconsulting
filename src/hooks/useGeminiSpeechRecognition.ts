
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { recordAudio, processAudioInput } from '@/services/gemini/audio';

export const useGeminiSpeechRecognition = (
  apiKey: string,
  onTranscription: (text: string) => void = () => {}
) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Check browser support for MediaRecorder
  useEffect(() => {
    const checkMediaRecorderSupport = () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        setIsSupported(false);
        toast({
          title: "Browser Incompatible",
          description: "Audio recording is not supported in this browser. Please try Chrome, Edge, or Safari.",
          variant: "destructive"
        });
      }
    };
    
    checkMediaRecorderSupport();
  }, [toast]);

  // Clean up media resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start recording function
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setVoiceError('Audio recording is not supported in this browser');
      return;
    }
    
    try {
      setVoiceError(null);
      setIsListening(true);
      
      // Show toast notification that we're listening
      toast({
        title: "Listening...",
        description: "Speak now. Your voice will be converted to text using Gemini.",
      });
      
      // Record audio
      const audioBlob = await recordAudio(10000); // 10 seconds max
      
      if (!audioBlob) {
        throw new Error('Failed to record audio');
      }
      
      // We have audio, now process it
      setIsListening(false);
      setIsTranscribing(true);
      
      // Process audio with Gemini
      const transcription = await processAudioInput(audioBlob, {
        apiKey,
        model: 'gemini-2.0-vision', // Vision model handles multimodal including audio
        speechConfig: {
          voice_name: 'Charon'
        }
      });
      
      setTranscript(transcription);
      setIsTranscribing(false);
      
      // Callback with transcription
      onTranscription(transcription);
    } catch (error) {
      console.error('Error recording or processing audio:', error);
      setVoiceError(error instanceof Error ? error.message : 'Unknown error processing audio');
      setIsListening(false);
      setIsTranscribing(false);
      
      toast({
        title: "Audio Processing Error",
        description: error instanceof Error ? error.message : 'Unknown error processing audio',
        variant: "destructive"
      });
    }
  }, [isSupported, apiKey, onTranscription, toast]);

  // Stop recording function
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsListening(false);
  }, []);

  // Toggle recording function
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isTranscribing,
    transcript,
    toggleListening,
    startListening,
    stopListening,
    voiceError,
    isVoiceSupported: isSupported
  };
};
