
export interface AudioConfig {
  sampleRate?: number;
  audioFormat?: string;
  language?: string;
  voice?: string;
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  sampleRate: 24000,
  audioFormat: 'mp3',
  language: 'en-US',
  voice: 'en-US-Neural2-F'
};

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  position: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export interface AudioMessage {
  type: 'audio';
  content: ArrayBuffer;
  metadata?: {
    duration: number;
    format: string;
    language?: string;
  };
}
