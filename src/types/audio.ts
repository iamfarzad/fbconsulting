export interface AudioMetadata {
  total_size: number;
  chunk_size: number;
}

export interface AudioMessage {
  type: 'text' | 'error' | 'audio' | 'audio_meta' | 'complete' | 'pong';
  content?: string;
  error?: string;
  total_size?: number;
  chunk_size?: number;
  chunks_processed?: number;
  total_chunks?: number;
}

export interface VoiceConfig {
  name: string;
  language: string;
  rate: number;
  pitch: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  error: string | null;
  progress: number;
}

export interface AudioPlaybackActions {
  handleAudioChunk: (chunk: Blob) => void;
  handleAudioMetadata: (metadata: AudioMetadata) => void;
  playAudioChunks: () => Promise<void>;
  stopAudio: () => void;
  clearAudio: () => void;
}

export interface AudioServiceConfig {
  // General settings
  maxRetries: number;
  retryDelay: number;

  // Chunking settings
  chunkSize: number;
  chunkDelay: number;

  // Audio quality settings
  sampleRate: number;
  channels: number;
  bitDepth: number;
}

// Default configuration values
export const DEFAULT_AUDIO_CONFIG: AudioServiceConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  chunkSize: 32 * 1024, // 32KB chunks
  chunkDelay: 10, // 10ms delay between chunks
  sampleRate: 48000,
  channels: 2,
  bitDepth: 16
};

// Voice configuration presets
export const VOICE_PRESETS: Record<string, VoiceConfig> = {
  default: {
    name: "Charon",
    language: "en-US",
    rate: 1.0,
    pitch: 0.0
  },
  fast: {
    name: "Charon",
    language: "en-US",
    rate: 1.5,
    pitch: 0.0
  },
  slow: {
    name: "Charon",
    language: "en-US",
    rate: 0.8,
    pitch: 0.0
  }
};
