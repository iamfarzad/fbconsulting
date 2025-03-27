import { useState, useEffect, useCallback, useRef } from 'react';
import VoiceServiceImpl from '@/services/voice/voiceService';
import { 
  VoiceService, 
  VoiceServiceState, 
  VoiceRecognitionOptions, 
  VoiceSynthesisOptions 
} from '@/types/voiceService';
import { useToast } from './use-toast';

interface UseVoiceServiceOptions {
  onTranscriptUpdate?: (transcript: string) => void;
  onTranscriptComplete?: (finalTranscript: string) => void;
  showToasts?: boolean;
  recognitionOptions?: VoiceRecognitionOptions;
}

export const useVoiceService = (options: UseVoiceServiceOptions = {}) => {
  const {
    onTranscriptUpdate,
    onTranscriptComplete,
    showToasts = true,
    recognitionOptions
  } = options;
  
  const [state, setState] = useState<VoiceServiceState>({
    recognition: {
      isListening: false,
      transcript: '',
      isSupported: false,
      error: null,
      isTranscribing: false
    },
    synthesis: {
      isSpeaking: false,
      isPaused: false,
      isSupported: false,
      error: null
    }
  });
  
  const serviceRef = useRef<VoiceService | null>(null);
  const { toast } = useToast();
  
  // Initialize voice service
  useEffect(() => {
    const handleStateChange = (newState: VoiceServiceState) => {
      setState(newState);
      
      // Show toast for errors if enabled
      if (showToasts) {
        if (newState.recognition.error && !state.recognition.error) {
          toast({
            title: "Voice Recognition Error",
            description: newState.recognition.error,
            variant: "destructive"
          });
        }
        
        if (newState.synthesis.error && !state.synthesis.error) {
          toast({
            title: "Voice Synthesis Error",
            description: newState.synthesis.error,
            variant: "destructive"
          });
        }
      }
    };
    
    serviceRef.current = new VoiceServiceImpl(
      handleStateChange, 
      onTranscriptUpdate,
      onTranscriptComplete,
      recognitionOptions
    );
    
    return () => {
      if (serviceRef.current) {
        // Clean up any active speech
        if (state.recognition.isListening) {
          serviceRef.current.stopListening();
        }
        
        if (state.synthesis.isSpeaking) {
          serviceRef.current.stopSpeaking();
        }
      }
    };
  }, []);  // Empty dependency array ensures this only runs once
  
  // Expose methods from the service
  const startListening = useCallback(async () => {
    if (serviceRef.current) {
      try {
        await serviceRef.current.startListening();
        
        if (showToasts) {
          toast({
            title: "Listening...",
            description: "Speak now. Your voice will be converted to text.",
          });
        }
      } catch (error) {
        console.error('Failed to start listening:', error);
      }
    }
  }, [showToasts, toast]);
  
  const stopListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopListening();
    }
  }, []);
  
  const toggleListening = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.toggleListening();
    }
  }, []);
  
  const resetTranscript = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resetTranscript();
    }
  }, []);
  
  const speak = useCallback(async (text: string, options?: VoiceSynthesisOptions) => {
    if (serviceRef.current) {
      try {
        await serviceRef.current.speak(text, options);
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
  }, []);
  
  const stopSpeaking = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopSpeaking();
    }
  }, []);
  
  const pauseSpeaking = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.pauseSpeaking();
    }
  }, []);
  
  const resumeSpeaking = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resumeSpeaking();
    }
  }, []);
  
  return {
    // State
    state,
    isListening: state.recognition.isListening,
    transcript: state.recognition.transcript,
    isSpeaking: state.synthesis.isSpeaking,
    isPaused: state.synthesis.isPaused,
    recognitionSupported: state.recognition.isSupported,
    synthesisSupported: state.synthesis.isSupported,
    recognitionError: state.recognition.error,
    synthesisError: state.synthesis.error,
    
    // Recognition methods
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    
    // Synthesis methods
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking
  };
};
