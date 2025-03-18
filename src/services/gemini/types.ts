
import { 
  HarmCategory,
  HarmBlockThreshold,
  SafetySetting,
  GenerationConfig
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

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: SafetySetting[];
}

// Default configuration for Gemini chat
export const DEFAULT_CONFIG: Partial<GenerationConfig> = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

// Default safety settings
export const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARASSMENT,
    threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HATE_SPEECH,
    threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.MEDIUM_AND_ABOVE,
  },
];
