
import { initializeGemini } from './initialize';
import { GeminiConfig } from './types';
import { Part, Content } from '@google/generative-ai';

/**
 * Send a multimodal request to Gemini (text + images)
 */
export async function sendMultimodalRequest(
  text: string,
  images: { mimeType: string, data: string }[],
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
      model: "gemini-2.0-vision" // Use gemini-2.0-vision for multimodal
    });
    
    // Create content array with text and images
    const parts: Part[] = [
      { text },
      ...images.map(img => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      }))
    ];
    
    // If we have chat history, use it to maintain context
    if (chatHistory.length > 0) {
      // Create a chat with history
      const chat = model.startChat({
        history: chatHistory.map(parts => ({ 
          role: 'user', 
          parts 
        }) as Content),
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
  private model;
  private chat;
  private chatHistory: Part[][] = [];
  
  constructor(config: GeminiConfig) {
    if (!config.apiKey) {
      throw new Error('Gemini API key is not available');
    }
    
    // Initialize the Gemini vision model
    this.model = initializeGemini({
      ...config,
      model: "gemini-2.0-vision" // Use gemini-2.0-vision for multimodal chat
    });
    
    // Start a chat session
    this.chat = this.model.startChat({
      history: [],
    });
  }
  
  /**
   * Send a message with optional images to the chat
   */
  async sendMessage(text: string, images: { mimeType: string, data: string }[] = []): Promise<string> {
    try {
      // Create content parts with text and images
      const parts: Part[] = [
        { text },
        ...images.map(img => ({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data
          }
        }))
      ];
      
      // Add user message to history
      this.chatHistory.push(parts);
      
      // Send the message
      const result = await this.chat.sendMessage(parts);
      const responseText = result.response.text();
      
      // Add assistant response to history (simplified - in practice would need to parse)
      this.chatHistory.push([{ text: responseText }]);
      
      return responseText;
    } catch (error) {
      console.error('Error in multimodal chat:', error);
      throw error;
    }
  }
  
  /**
   * Get the current chat history
   */
  getHistory(): Part[][] {
    return this.chatHistory;
  }
  
  /**
   * Clear the chat history
   */
  clearHistory(): void {
    this.chatHistory = [];
    this.chat = this.model.startChat({
      history: [],
    });
  }
}
