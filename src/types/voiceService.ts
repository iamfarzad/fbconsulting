
export interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  autoStop?: boolean;
  stopAfterSeconds?: number;
}

export interface VoiceSynthesisOptions {
  voice?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  isTranscribing: boolean;
}

export interface VoiceSynthesisState {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  error: string | null;
}

export interface VoiceServiceState {
  recognition: VoiceRecognitionState;
  synthesis: VoiceSynthesisState;
}

export interface VoiceService {
  // Recognition methods
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
  resetTranscript: () => void;
  
  // Synthesis methods
  speak: (text: string, options?: VoiceSynthesisOptions) => Promise<void>;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  
  // Service state
  state: VoiceServiceState;
}
