
// Basic message types for the chat service
export interface AIMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
  id?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'error';

// Simple response types for the Gemini API
export interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
}

export interface GeminiResponse {
  text: string;
  error?: string;
}

// Voice configuration types
export interface VoiceConfig {
  voice: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

// Configuration for Gemini
export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  voice?: VoiceConfig;
  languageCode?: string;
}

// Default configurations
export const DEFAULT_CONFIG: GeminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: 'gemini-2.0-flash',
  temperature: 0.7,
  maxOutputTokens: 2048
};
