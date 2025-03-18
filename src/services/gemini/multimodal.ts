
import { initializeGemini } from './initialize';
import { GeminiConfig } from './types';
import { Part } from '@google/generative-ai';

/**
 * Send a multimodal request to Gemini (text + images)
 */
export async function sendMultimodalRequest(
  text: string,
  images: { mimeType: string, data: string }[],
  config: GeminiConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini vision model
    const model = initializeGemini({
      ...config,
      model: "gemini-2.0-vision" // Use gemini-2.0-vision for multimodal
    });
    
    // Create a content array with text and images
    const parts: Part[] = [
      { text },
      ...images.map(img => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      }))
    ];
    
    const result = await model.generateContent(parts);
    return result.response.text();
  } catch (error) {
    console.error('Error sending multimodal request to Gemini:', error);
    throw error;
  }
}
