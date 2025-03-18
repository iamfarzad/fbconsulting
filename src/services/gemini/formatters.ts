
import { Part, Content } from '@google/generative-ai';
import { GeminiMessage } from './types';

/**
 * Format messages for the Gemini SDK chat history format
 */
export function formatMessagesForSDK(messages: GeminiMessage[]): Content[] {
  return messages.map(msg => ({
    role: msg.role,
    parts: msg.parts.map(part => {
      if (part.text) {
        return { text: part.text };
      } else if (part.inlineData) {
        return {
          inlineData: {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data
          }
        };
      }
      return { text: "" };
    })
  }));
}

/**
 * Convert parts array to the format expected by the Gemini SDK
 */
export function convertPartsToContent(parts: any[]): Part[] {
  return parts.map(part => {
    if (part.text) {
      return { text: part.text };
    } else if (part.inlineData) {
      return {
        inlineData: {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data
        }
      };
    }
    return { text: "" };
  });
}

/**
 * Converts AIMessages to Gemini message format
 */
export function convertToGeminiMessages(messages: any[], systemPrompt?: string): GeminiMessage[] {
  const geminiMessages: GeminiMessage[] = [];
  
  // Add system prompt as a user message if provided
  if (systemPrompt) {
    geminiMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    // Add a placeholder model response to maintain conversation flow
    geminiMessages.push({
      role: 'model',
      parts: [{ text: 'I understand and will follow these instructions.' }]
    });
  }
  
  // Convert the rest of the messages
  messages.forEach((msg: any) => {
    if (msg.role === 'user' || msg.role === 'assistant') {
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
  });
  
  return geminiMessages;
}
