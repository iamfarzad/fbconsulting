import { VoiceConfig } from './audio';

export const DEFAULT_SPEECH_CONFIG = {
  voice: {
    name: "Charon",
    language: "en-US",
    rate: 1.0,
    pitch: 0.0
  },
  languageCode: "en-US"
};

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  voice?: VoiceConfig;
  languageCode?: string;
}

export const DEFAULT_CONFIG: GeminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-pro',
  temperature: 0.7,
  maxOutputTokens: 2048,
  ...DEFAULT_SPEECH_CONFIG
};
