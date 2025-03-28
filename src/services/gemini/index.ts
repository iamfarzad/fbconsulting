
import { API_CONFIG } from '@/config/api';

export { useGeminiWebSocket } from '@/features/gemini/hooks/useGeminiWebSocket'; 
export { useGeminiService } from '@/features/gemini/hooks/useGeminiService';
export { useGeminiAudioPlayback } from '@/features/gemini/hooks/useGeminiAudioPlayback';

interface GeminiConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  safetySettings?: any[];
}

/**
 * Send a text-only request to the Gemini API
 */
export async function sendGeminiChatRequest(
  messages: Array<{ role: string; content: string }>,
  config: GeminiConfig
): Promise<string> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DEFAULT_ENDPOINTS.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        messages,
        model: config.model || 'gemini-pro',
        max_tokens: config.maxTokens || 1024,
        temperature: config.temperature || 0.7,
        safety_settings: config.safetySettings || []
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.text || data.response || '';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Send a multimodal request with text and optional images to the Gemini API
 */
export async function sendMultimodalRequest(
  text: string,
  images: Array<{ mimeType: string; data: string }> = [],
  config: GeminiConfig
): Promise<string> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DEFAULT_ENDPOINTS.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        text,
        images,
        model: config.model || 'gemini-pro-vision',
        max_tokens: config.maxTokens || 1024,
        temperature: config.temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.text || data.response || '';
  } catch (error) {
    console.error('Error calling Gemini multimodal API:', error);
    throw error;
  }
}

/**
 * Convert chat messages to Gemini format
 */
export function convertToGeminiMessages(messages: Array<{ role: string; content: string }>): Array<{ role: string; content: string }> {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'model' : 'system',
    content: msg.content
  }));
}

// Default configuration
export const DEFAULT_CONFIG = {
  maxTokens: 1024,
  temperature: 0.7,
  topP: 0.95,
  topK: 40
};

// Default safety settings
export const DEFAULT_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
];
