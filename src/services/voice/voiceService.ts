import { EventEmitter } from 'events';

export type VoiceServiceEvents = {
  stateChanged: (state: VoiceServiceState) => void;
  error: (error: Error) => void;
  transcript: (text: string, isFinal: boolean) => void;
  audioEnded: () => void;
};

export interface VoiceServiceState {
  recognition: {
    isSupported: boolean;
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    error: Error | null;
  };
  speech: {
    isSupported: boolean;
    isSpeaking: boolean;
    isPaused: boolean;
    error: Error | null;
  };
}

export interface VoiceServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface VoiceService {
  initialize(): Promise<void>;
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  toggleListening(): Promise<void>;
  speak(text: string): Promise<void>;
  stopSpeaking(): Promise<void>;
  pauseSpeaking(): Promise<void>;
  resumeSpeaking(): Promise<void>;
  getState(): VoiceServiceState;
  dispose(): void;
  on<E extends keyof VoiceServiceEvents>(
    event: E, 
    listener: VoiceServiceEvents[E]
  ): void;
  off<E extends keyof VoiceServiceEvents>(
    event: E, 
    listener: VoiceServiceEvents[E]
  ): void;
}

// Initial state with everything disabled/inactive
export const initialVoiceState: VoiceServiceState = {
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
};

export class VoiceServiceImpl implements VoiceService {
  private recognition: SpeechRecognition | null = null;
  private audio: HTMLAudioElement | null = null;
  private state: VoiceServiceState = { ...initialVoiceState };
  private eventEmitter = new EventEmitter();
  private config: VoiceServiceConfig;
  
  constructor(config: VoiceServiceConfig = {}) {
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      ...config,
    };
  }

  async initialize(): Promise<void> {
    // Check for browser support
    const recognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const speechSupported = 'speechSynthesis' in window;
    
    this.state = {
      recognition: {
        ...this.state.recognition,
        isSupported: recognitionSupported,
      },
      speech: {
        ...this.state.speech,
        isSupported: speechSupported,
      },
    };
    
    // Initialize Web Speech API if supported
    if (recognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure recognition
      this.recognition.lang = this.config.language || 'en-US';
      this.recognition.continuous = this.config.continuous !== false;
      this.recognition.interimResults = this.config.interimResults !== false;
      this.recognition.maxAlternatives = this.config.maxAlternatives || 1;
      
      // Set up event handlers
      this.recognition.onstart = () => {
        this.updateState({
          recognition: {
            ...this.state.recognition,
            isListening: true,
            error: null,
          },
        });
      };
      
      this.recognition.onend = () => {
        this.updateState({
          recognition: {
            ...this.state.recognition,
            isListening: false,
          },
        });
      };
      
      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          this.updateState({
            recognition: {
              ...this.state.recognition,
              transcript: this.state.recognition.transcript + finalTranscript,
            },
          });
          this.eventEmitter.emit('transcript', this.state.recognition.transcript, true);
        }
        
        if (interimTranscript) {
          this.updateState({
            recognition: {
              ...this.state.recognition,
              interimTranscript,
            },
          });
          this.eventEmitter.emit('transcript', interimTranscript, false);
        }
      };
      
      this.recognition.onerror = (event) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        this.updateState({
          recognition: {
            ...this.state.recognition,
            error,
          },
        });
        this.eventEmitter.emit('error', error);
      };
    }
    
    // Initialize audio element for speech synthesis
    if (speechSupported) {
      this.audio = new Audio();
      
      this.audio.onended = () => {
        this.updateState({
          speech: {
            ...this.state.speech,
            isSpeaking: false,
            isPaused: false,
          },
        });
        this.eventEmitter.emit('audioEnded');
      };
      
      this.audio.onpause = () => {
        this.updateState({
          speech: {
            ...this.state.speech,
            isPaused: true,
          },
        });
      };
      
      this.audio.onplay = () => {
        this.updateState({
          speech: {
            ...this.state.speech,
            isSpeaking: true,
            isPaused: false,
          },
        });
      };
      
      this.audio.onerror = (event) => {
        const error = new Error(`Audio playback error: ${event}`);
        this.updateState({
          speech: {
            ...this.state.speech,
            error,
          },
        });
        this.eventEmitter.emit('error', error);
      };
    }
    
    this.emitState();
  }
  
  async startListening(): Promise<void> {
    if (!this.recognition || !this.state.recognition.isSupported) {
      const error = new Error('Speech recognition is not supported in this browser');
      this.eventEmitter.emit('error', error);
      throw error;
    }
    
    if (this.state.recognition.isListening) {
      return;
    }
    
    try {
      // Reset transcript when starting a new listening session
      this.updateState({
        recognition: {
          ...this.state.recognition,
          transcript: '',
          interimTranscript: '',
        },
      });
      
      this.recognition.start();
    } catch (error) {
      this.updateState({
        recognition: {
          ...this.state.recognition,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  async stopListening(): Promise<void> {
    if (!this.recognition || !this.state.recognition.isListening) {
      return;
    }
    
    try {
      this.recognition.stop();
    } catch (error) {
      this.updateState({
        recognition: {
          ...this.state.recognition,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  async toggleListening(): Promise<void> {
    if (this.state.recognition.isListening) {
      await this.stopListening();
    } else {
      await this.startListening();
    }
  }
  
  async speak(text: string): Promise<void> {
    if (!this.audio || !this.state.speech.isSupported) {
      const error = new Error('Speech synthesis is not supported in this browser');
      this.eventEmitter.emit('error', error);
      throw error;
    }
    
    if (this.state.speech.isSpeaking) {
      await this.stopSpeaking();
    }
    
    try {
      // TODO: Replace with actual API call to get audio
      // For now, we'll use a mock implementation
      
      // In a real implementation, you would:
      // 1. Call your text-to-speech API
      // const response = await fetch('/api/gemini/audio', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text }),
      // });
      // 
      // 2. Get the audio blob
      // const audioBlob = await response.blob();
      // 
      // 3. Create an object URL and set it as the audio source
      // const audioUrl = URL.createObjectURL(audioBlob);
      // this.audio.src = audioUrl;
      
      // Mock implementation - replace with actual API call
      this.audio.src = `data:audio/mp3;base64,${btoa('Mock audio data')}`;
      
      // Play the audio
      await this.audio.play();
      
      this.updateState({
        speech: {
          ...this.state.speech,
          isSpeaking: true,
          isPaused: false,
          error: null,
        },
      });
    } catch (error) {
      this.updateState({
        speech: {
          ...this.state.speech,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  async stopSpeaking(): Promise<void> {
    if (!this.audio || !this.state.speech.isSpeaking) {
      return;
    }
    
    try {
      this.audio.pause();
      this.audio.currentTime = 0;
      
      this.updateState({
        speech: {
          ...this.state.speech,
          isSpeaking: false,
          isPaused: false,
        },
      });
    } catch (error) {
      this.updateState({
        speech: {
          ...this.state.speech,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  async pauseSpeaking(): Promise<void> {
    if (!this.audio || !this.state.speech.isSpeaking || this.state.speech.isPaused) {
      return;
    }
    
    try {
      this.audio.pause();
    } catch (error) {
      this.updateState({
        speech: {
          ...this.state.speech,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  async resumeSpeaking(): Promise<void> {
    if (!this.audio || !this.state.speech.isPaused) {
      return;
    }
    
    try {
      await this.audio.play();
    } catch (error) {
      this.updateState({
        speech: {
          ...this.state.speech,
          error: error as Error,
        },
      });
      this.eventEmitter.emit('error', error as Error);
      throw error;
    }
  }
  
  getState(): VoiceServiceState {
    return this.state;
  }
  
  dispose(): void {
    if (this.recognition && this.state.recognition.isListening) {
      this.recognition.stop();
    }
    
    if (this.audio && this.state.speech.isSpeaking) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    
    this.eventEmitter.removeAllListeners();
  }
  
  on<E extends keyof VoiceServiceEvents>(
    event: E, 
    listener: VoiceServiceEvents[E]
  ): void {
    this.eventEmitter.on(event, listener as any);
  }
  
  off<E extends keyof VoiceServiceEvents>(
    event: E, 
    listener: VoiceServiceEvents[E]
  ): void {
    this.eventEmitter.off(event, listener as any);
  }
  
  private updateState(partialState: Partial<VoiceServiceState>): void {
    this.state = {
      ...this.state,
      ...partialState,
    };
    this.emitState();
  }
  
  private emitState(): void {
    this.eventEmitter.emit('stateChanged', this.state);
  }
}

// Create a singleton instance of the voice service
let voiceServiceInstance: VoiceService | null = null;

export const getVoiceService = (config?: VoiceServiceConfig): VoiceService => {
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceServiceImpl(config);
    voiceServiceInstance.initialize();
  }
  return voiceServiceInstance;
};
