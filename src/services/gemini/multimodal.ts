import { initializeGemini } from './initialize';
import { GeminiConfig } from './types';
import { Part, Content } from '@google/generative-ai';

/**
 * Send a multimodal request to Gemini (text + images + documents)
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
      model: "gemini-2.0-vision" // Use gemini-2.0-vision for multimodal
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
   * Send a message with optional files to the chat
   */
  async sendMessage(
    text: string, 
    files: { mimeType: string, data: string, name?: string, type?: string }[] = []
  ): Promise<string> {
    try {
      // Create content parts with text and files
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
