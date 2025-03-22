import { 
  GoogleGenerativeAI as GenerativeAI,
  GenerativeModel
} from 'google-generativeai';
import { GeminiConfig, DEFAULT_CONFIG, DEFAULT_SAFETY_SETTINGS } from './types';

/**
 * Initialize the Gemini API with the specified configuration
 */
export function initializeGemini(config: GeminiConfig): GenerativeModel {
  if (!config.apiKey) {
    throw new Error('Gemini API key is required');
  }
  
  // Create the GenerativeAI instance with the API key and explicitly set API version to v1
  const genAI = new GenerativeAI(config.apiKey, { apiVersion: 'v1' });
  
  // Get the model with the specified configuration
  return genAI.getGenerativeModel({ 
    model: config.model || "gemini-2.0-flash", // Using the standard Gemini Pro model
    generationConfig: {
      temperature: config.temperature ?? DEFAULT_CONFIG.temperature,
      topP: config.topP ?? DEFAULT_CONFIG.topP,
      topK: config.topK ?? DEFAULT_CONFIG.topK,
      maxOutputTokens: config.maxOutputTokens ?? DEFAULT_CONFIG.maxOutputTokens,
      stopSequences: config.stopSequences ?? DEFAULT_CONFIG.stopSequences,
    },
    safetySettings: config.safetySettings ?? DEFAULT_SAFETY_SETTINGS,
  });
}
