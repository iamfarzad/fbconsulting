import { Content } from '@google/generative-ai';

export interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
}

export interface GeminiConfig {
  apiKey: string;
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface SpeechConfig {
  language: string;
  name: string;
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
}

export const DEFAULT_SPEECH_CONFIG: SpeechConfig = {
  language: 'en-US',
  name: 'en-US-Standard-A',
  ssmlGender: 'NEUTRAL'
};

export interface GeminiResponse {
  text: string;
  error?: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  content: Content[];
}
