import { GeminiConfig } from './types';

export async function initializeGemini(config: GeminiConfig) {
  try {
    const response = await fetch('/api/gemini/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Gemini');
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing Gemini:', error);
    throw error;
  }
}
