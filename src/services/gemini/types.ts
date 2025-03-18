
import { 
  HarmCategory,
  HarmBlockThreshold,
  SafetySetting,
  GenerationConfig,
  Part 
} from '@google/generative-ai';

// Types for Gemini message formats
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }[];
}

// Speech configuration for Gemini
export interface SpeechConfig {
  voice_name: 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';
  audio_format?: string; // 'wav' | 'mp3' | 'aiff' | 'aac' | 'ogg' | 'flac'
  speaking_rate?: number; // 0.25 to 4.0, default 1.0
  pitch?: number; // -20.0 to 20.0, default 0
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: SafetySetting[];
  speechConfig?: SpeechConfig;
}

// Default configuration for Gemini chat
export const DEFAULT_CONFIG: Partial<GenerationConfig> = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

// Default speech configuration
export const DEFAULT_SPEECH_CONFIG: SpeechConfig = {
  voice_name: 'Charon',
  audio_format: 'mp3'
};

// Default safety settings
export const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
