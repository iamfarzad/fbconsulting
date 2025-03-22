import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiConfig } from './types';

export function initializeGemini(config: GeminiConfig) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  return genAI.getGenerativeModel({
    model: config.model,
    generationConfig: {
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
      maxOutputTokens: config.maxOutputTokens,
      stopSequences: config.stopSequences
    },
    safetySettings: config.safetySettings
  });
}
