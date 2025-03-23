export interface GeminiResponse {
  text: string;
  error?: string;
}

export interface GeminiRequest {
  prompt: string;
  images?: Array<{
    mimeType: string;
    data: string;
  }>;
  persona?: string;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

export interface SpeechConfig {
  voice_name: string;
  audio_format?: string;
  speaking_rate?: number;
  pitch?: number;
}

// Default configuration for requests
export const DEFAULT_CONFIG: Partial<GeminiConfig> = {
  temperature: 0.9,
  topP: 1,
  topK: 40,
  maxOutputTokens: 2048
};

// Safety settings for content filtering
export const DEFAULT_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
];
