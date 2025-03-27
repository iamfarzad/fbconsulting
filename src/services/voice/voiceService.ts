import { useState, useRef, useCallback } from 'react';
import { 
  VoiceService, 
  VoiceServiceState, 
  VoiceRecognitionOptions,
  VoiceSynthesisOptions
} from '@/types/voiceService';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/types/voice';

class VoiceServiceImpl implements VoiceService {
  private recognitionInstance: SpeechRecognition | null = null;
  private synthesisUtterance: SpeechSynthesisUtterance | null = null;
  private timeoutRef: NodeJS.Timeout | null = null;

  private recognitionState = {
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null as string | null,
    isTranscribing: false
  };

  private synthesisState = {
    isSpeaking: false,
    isPaused: false,
    isSupported: false,
    error: null as string | null
  };

  private onStateChange: (state: VoiceServiceState) => void;
  private onTranscriptUpdate?: (transcript: string) => void;
  private onTranscriptComplete?: (finalTranscript: string) => void;
  private recognitionOptions: VoiceRecognitionOptions;

  constructor(
    onStateChange: (state: VoiceServiceState) => void,
    onTranscriptUpdate?: (transcript: string) => void,
    onTranscriptComplete?: (finalTranscript: string) => void,
    options: VoiceRecognitionOptions = {}
  ) {
    this.onStateChange = onStateChange;
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onTranscriptComplete = onTranscriptComplete;
    this.recognitionOptions = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      autoStop: true,
      stopAfterSeconds: 10,
      ...options
    };

    // Check speech recognition support
    this.recognitionState.isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    
    // Check speech synthesis support
    this.synthesisState.isSupported = 'speechSynthesis' in window;

    // Notify initial state
    this.emitState();
  }

  get state(): VoiceServiceState {
    return {
      recognition: { ...this.recognitionState },
      synthesis: { ...this.synthesisState }
    };
  }

  private emitState() {
    this.onStateChange(this.state);
  }

  async startListening(): Promise<void> {
    if (!this.recognitionState.isSupported) {
      this.recognitionState.error = 'Speech recognition not supported in this browser';
      this.emitState();
      return Promise.reject(new Error('Speech recognition not supported'));
    }

    if (this.recognitionState.isListening) {
      return Promise.resolve();
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create recognition instance
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognitionInstance = new SpeechRecognitionAPI();
      
      // Configure recognition
      const { language, continuous, interimResults } = this.recognitionOptions;
      this.recognitionInstance.lang = language || 'en-US';
      this.recognitionInstance.continuous = continuous !== false;
      this.recognitionInstance.interimResults = interimResults !== false;
      
      // Set up event handlers
      let finalTranscript = '';
      
      this.recognitionInstance.onstart = () => {
        this.recognitionState.isListening = true;
        this.recognitionState.transcript = '';
        this.recognitionState.error = null;
        this.emitState();
      };
      
      this.recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            
            // Report final result if callback exists
            if (this.onTranscriptComplete) {
              this.onTranscriptComplete(finalTranscript.trim());
            }
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update current transcript
        const currentTranscript = (finalTranscript + interimTranscript).trim();
        this.recognitionState.transcript = currentTranscript;
        
        // Call transcript update callback if exists
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(currentTranscript);
        }
        
        this.emitState();
      };
      
      this.recognitionInstance.onerror = (event: any) => {
        const errorMessage = event.error || 'Unknown speech recognition error';
        
        let userMessage = 'Error with voice recognition';
        switch (errorMessage) {
          case 'not-allowed':
            userMessage = 'Microphone access denied';
            break;
          case 'no-speech':
            userMessage = 'No speech detected';
            break;
          case 'network':
            userMessage = 'Network error occurred';
            break;
          default:
            userMessage = `Voice error: ${errorMessage}`;
        }
        
        this.recognitionState.error = userMessage;
        this.recognitionState.isListening = false;
        this.emitState();
      };
      
      this.recognitionInstance.onend = () => {
        this.recognitionState.isListening = false;
        
        // Clean up timeout
        if (this.timeoutRef) {
          clearTimeout(this.timeoutRef);
          this.timeoutRef = null;
        }
        
        this.emitState();
        this.recognitionInstance = null;
      };
      
      // Start recognition
      this.recognitionInstance.start();
      
      // Set auto-stop timer if enabled
      if (this.recognitionOptions.autoStop && this.recognitionOptions.stopAfterSeconds) {
        this.timeoutRef = setTimeout(() => {
          this.stopListening();
        }, this.recognitionOptions.stopAfterSeconds * 1000);
      }
      
      return Promise.resolve();
    } catch (error) {
      this.recognitionState.error = error instanceof Error 
        ? error.message 
        : 'Failed to start speech recognition';
      this.recognitionState.isListening = false;
      this.emitState();
      return Promise.reject(error);
    }
  }

  stopListening(): void {
    if (!this.recognitionState.isListening || !this.recognitionInstance) {
      return;
    }
    
    try {
      this.recognitionInstance.stop();
      
      if (this.timeoutRef) {
        clearTimeout(this.timeoutRef);
        this.timeoutRef = null;
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  async toggleListening(): Promise<void> {
    if (this.recognitionState.isListening) {
      this.stopListening();
      return Promise.resolve();
    } else {
      return this.startListening();
    }
  }

  resetTranscript(): void {
    this.recognitionState.transcript = '';
    this.emitState();
  }

  async speak(text: string, options: VoiceSynthesisOptions = {}): Promise<void> {
    if (!this.synthesisState.isSupported) {
      this.synthesisState.error = 'Speech synthesis not supported in this browser';
      this.emitState();
      return Promise.reject(new Error('Speech synthesis not supported'));
    }
    
    return new Promise((resolve, reject) => {
      try {
        // Stop any current speech
        this.stopSpeaking();
        
        // Create and configure utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if provided
        if (options.voice) {
          const voices = window.speechSynthesis.getVoices();
          const selectedVoice = voices.find(v => v.name === options.voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        
        // Set other options
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.rate) utterance.rate = options.rate;
        if (options.volume) utterance.volume = options.volume;
        
        // Set event handlers
        utterance.onstart = () => {
          this.synthesisState.isSpeaking = true;
          this.synthesisState.isPaused = false;
          this.emitState();
        };
        
        utterance.onend = () => {
          this.synthesisState.isSpeaking = false;
          this.synthesisState.isPaused = false;
          this.synthesisUtterance = null;
          this.emitState();
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.synthesisState.error = `Speech synthesis error: ${event.error}`;
          this.synthesisState.isSpeaking = false;
          this.synthesisUtterance = null;
          this.emitState();
          reject(new Error(event.error));
        };
        
        // Store reference to utterance
        this.synthesisUtterance = utterance;
        
        // Start speaking
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        this.synthesisState.error = error instanceof Error 
          ? error.message 
          : 'Failed to start speech synthesis';
        this.emitState();
        reject(error);
      }
    });
  }

  stopSpeaking(): void {
    if (this.synthesisState.isSpeaking || this.synthesisState.isPaused) {
      window.speechSynthesis.cancel();
      this.synthesisState.isSpeaking = false;
      this.synthesisState.isPaused = false;
      this.synthesisUtterance = null;
      this.emitState();
    }
  }

  pauseSpeaking(): void {
    if (this.synthesisState.isSpeaking && !this.synthesisState.isPaused) {
      window.speechSynthesis.pause();
      this.synthesisState.isPaused = true;
      this.emitState();
    }
  }

  resumeSpeaking(): void {
    if (this.synthesisState.isPaused) {
      window.speechSynthesis.resume();
      this.synthesisState.isPaused = false;
      this.emitState();
    }
  }
}

export default VoiceServiceImpl;

// Note: Use environment variables for sensitive information
