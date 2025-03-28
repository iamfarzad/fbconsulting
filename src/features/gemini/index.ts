
// Export GeminiAdapter from services
export { GeminiAdapter } from './services/geminiAdapter';
export type { GenAIRequest, GenAIResponse } from './services/geminiAdapter';

// Export message types
export type { AIMessage, MessageRole } from './types';

// Re-export hooks for ease of use
export { useGeminiService } from '../../hooks/useGeminiService';
