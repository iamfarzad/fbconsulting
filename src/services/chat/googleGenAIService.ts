
import { AIMessage } from './messageTypes';

/**
 * Chat functionality with Google GenAI
 */

// Define message interface that's compatible with AIMessage
export interface GenAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  id?: string;
  metadata?: Record<string, any>;
}

// Export the ChatMessage interface for other modules to use
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// Convert GenAI messages to AIMessage format
export const convertToAIMessage = (message: GenAIChatMessage): AIMessage => {
  return {
    ...message,
    timestamp: message.timestamp || Date.now(),
  };
};

// Options for chat configuration
export interface ChatServiceOptions {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

// Export Gemini chat service class
export class GeminiChatService {
  private apiKey: string;
  private modelName: string;
  private temperature: number;
  private maxTokens: number;

  constructor(options: ChatServiceOptions) {
    this.apiKey = options.apiKey;
    this.modelName = options.modelName || 'gemini-pro';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1024;
  }

  async sendMessage(message: string, history: GenAIChatMessage[] = []): Promise<AIMessage> {
    // Mock implementation for now
    console.log('Sending message to Gemini:', message);
    console.log('With history:', history);
    
    // Return mock response
    return {
      role: 'assistant',
      content: `This is a mock response to: ${message}`,
      timestamp: Date.now()
    };
  }
}

// Utility function to get a chat service instance
export const getChatService = (options: ChatServiceOptions): GeminiChatService => {
  return new GeminiChatService(options);
};
