import { initializeGemini } from './initialize';
import { GeminiConfig, DEFAULT_SPEECH_CONFIG } from './types';
import { Part, Content } from 'google-generativeai';

/**
 * Send a multimodal request to Gemini (text + images + audio + documents)
 */
export async function sendMultimodalRequest(
  text: string,
  files: { mimeType: string, data: string, name?: string, type?: string }[],
  config: GeminiConfig,
  chatHistory: Part[][] = []
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini vision model
    const model = initializeGemini({
      ...config,
      model: "gemini-2.0-flash" // Use gemini-2.0-flash for multimodal
    });
    
    // Create content array with text and files
    const parts: Part[] = [
      { text }
    ];
    
    // Add files to parts array
    files.forEach(file => {
      if (file.mimeType.startsWith('image/')) {
        // Add image
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        });
      } else if (file.mimeType.startsWith('audio/')) {
        // For audio files, add as inlineData
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data
          }
        });
      } else {
        // For documents, add a text description and the file data
        const fileName = file.name || 'document';
        parts.push({
          text: `Document: ${fileName}\nMIME type: ${file.mimeType}\n`
        });
        
        // Only add the document data if it's not too large
        if (file.data.length < 100000) { // Limit to approximately 100KB
          parts.push({
            inlineData: {
              mimeType: file.mimeType,
              data: file.data
            }
          });
        } else {
          // For large documents, add a note
          parts.push({
            text: `Note: This document is too large to include in full. Please extract key information from what you can see.`
          });
        }
      }
    });
    
    // If we have chat history, use it to maintain context
    if (chatHistory.length > 0) {
      // Create a chat with history - properly format as Content array with role
      const chat = model.startChat({
        history: chatHistory.map(parts => ({ 
          role: 'user', 
          parts 
        })),
        generationConfig: {
          temperature: config.temperature,
          topP: config.topP,
          topK: config.topK,
          maxOutputTokens: config.maxOutputTokens,
          stopSequences: config.stopSequences
        },
        safetySettings: config.safetySettings
      });
      
      // Send the message with the new parts
      const result = await chat.sendMessage(parts);
      return result.response.text();
    } else {
      // For first message without history, use generateContent
      const result = await model.generateContent(parts);
      return result.response.text();
    }
  } catch (error) {
    console.error('Error sending multimodal request to Gemini:', error);
    throw error;
  }
}

/**
 * Create and maintain a multimodal chat session
 */
export class GeminiMultimodalChat {
  async sendMessage(prompt: string, images?: Array<{ mimeType: string; data: string }>) {
    const response = await fetch('/api/gemini/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        images
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send multimodal message');
    }

    const data = await response.json();
    return data.text;
  }
}
