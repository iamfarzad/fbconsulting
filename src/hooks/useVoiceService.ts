import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  VoiceService, 
  VoiceServiceState, 
  getVoiceService, 
  VoiceServiceConfig 
} from '../services/voice/voiceService';

export interface UseVoiceServiceProps {
  autoInitialize?: boolean;
  config?: VoiceServiceConfig;
}

export interface UseVoiceServiceResult {
  state: VoiceServiceState;
  isInitialized: boolean;
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  isPaused: boolean;
  error: Error | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  toggleListening: () => Promise<void>;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => Promise<void>;
  pauseSpeaking: () => Promise<void>;
  resumeSpeaking: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useVoiceService = ({
  autoInitialize = true,
  config
}: UseVoiceServiceProps = {}): UseVoiceServiceResult => {
  // Keep a reference to the voice service
  const serviceRef = useRef<VoiceService | null>(null);
  
  // State to track initialization
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State to store the voice service state
  const [state, setState] = useState<VoiceServiceState>({
    recognition: {
      isSupported: false,
      isListening: false,
      transcript: '',
      interimTranscript: '',
      error: null,
    },
    speech: {
      isSupported: false,
      isSpeaking: false,
      isPaused: false,
      error: null,
    },
  });

  // Initialize the voice service
  const initialize = useCallback(async () => {
    try {
      if (!serviceRef.current) {
        serviceRef.current = getVoiceService(config);
      }
      
      await serviceRef.current.initialize();
      setState(serviceRef.current.getState());
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize voice service:', error);
    }
  }, [config]);

  // Auto-initialize if enabled
  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }

    return () => {
      // Clean up on unmount
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, [autoInitialize, initialize]);

  // Set up event listeners when the service is ready
  useEffect(() => {
    if (serviceRef.current && isInitialized) {
      const handleStateChanged = (newState: VoiceServiceState) => {
        setState(newState);
      };

      const handleError = (error: Error) => {
        console.error('Voice service error:', error);
        // State will be updated via stateChanged event
      };

      serviceRef.current.on('stateChanged', handleStateChanged);
      serviceRef.current.on('error', handleError);

      return () => {
        if (serviceRef.current) {
          serviceRef.current.off('stateChanged', handleStateChanged);
          serviceRef.current.off('error', handleError);
        }
      };
    }
  }, [isInitialized]);

  // Actions
  const startListening = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.startListening();
    }
  }, [isInitialized]);

  const stopListening = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.stopListening();
    }
  }, [isInitialized]);

  const toggleListening = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.toggleListening();
    }
  }, [isInitialized]);

  const speak = useCallback(async (text: string) => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.speak(text);
    }
  }, [isInitialized]);

  const stopSpeaking = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.stopSpeaking();
    }
  }, [isInitialized]);

  const pauseSpeaking = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.pauseSpeaking();
    }
  }, [isInitialized]);

  const resumeSpeaking = useCallback(async () => {
    if (serviceRef.current && isInitialized) {
      await serviceRef.current.resumeSpeaking();
    }
  }, [isInitialized]);

  // Derived state for convenience
  const isSupported = 
    state.recognition.isSupported || 
    state.speech.isSupported;
  
  const error = 
    state.recognition.error || 
    state.speech.error;

  return {
    state,
    isInitialized,
    isSupported,
    isListening: state.recognition.isListening,
    transcript: state.recognition.transcript,
    interimTranscript: state.recognition.interimTranscript,
    isSpeaking: state.speech.isSpeaking,
    isPaused: state.speech.isPaused,
    error,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    initialize,
  };
};
