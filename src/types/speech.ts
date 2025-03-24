export interface SpeechRecognitionError extends Event {
  error: 'aborted' | 'audio-capture' | 'bad-grammar' | 'language-not-supported' | 'network' | 'no-speech' | 'not-allowed' | 'service-not-allowed';
  message: string;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionEventCallback {
  (event: Event): void;
}

export interface SpeechRecognitionErrorCallback {
  (event: SpeechRecognitionError): void;
}

export interface SpeechRecognitionResultCallback {
  (event: { results: SpeechRecognitionResultList }): void;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: SpeechRecognitionEventCallback | null;
  onaudiostart: SpeechRecognitionEventCallback | null;
  onend: SpeechRecognitionEventCallback | null;
  onerror: SpeechRecognitionErrorCallback | null;
  onnomatch: SpeechRecognitionEventCallback | null;
  onresult: SpeechRecognitionResultCallback | null;
  onsoundend: SpeechRecognitionEventCallback | null;
  onsoundstart: SpeechRecognitionEventCallback | null;
  onspeechend: SpeechRecognitionEventCallback | null;
  onspeechstart: SpeechRecognitionEventCallback | null;
  onstart: SpeechRecognitionEventCallback | null;
  abort(): void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}
