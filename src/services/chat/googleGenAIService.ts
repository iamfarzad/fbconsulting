
import { AIMessage, ChatService, ChatServiceOptions, FileAttachment, GeminiChatService } from './types';

/**
 * Create a Google GenAI service for chat
 */
export function getChatService(options: ChatServiceOptions): ChatService {
  // For now, return a mock implementation
  return new MockGeminiChatService(options);
}

/**
 * Mock implementation of the Google GenAI service
 */
class MockGeminiChatService implements GeminiChatService {
  private apiKey: string;
  private modelName: string;
  private temperature: number;
  private maxTokens: number;
  private messageHistory: AIMessage[] = [];

  constructor(options: ChatServiceOptions) {
    this.apiKey = options.apiKey;
    this.modelName = options.modelName || 'gemini-pro';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1024;
    
    console.log(`Initialized Mock Gemini Chat Service with model: ${this.modelName}`);
  }

  async sendMessage(message: string, history?: AIMessage[], files?: FileAttachment[]): Promise<AIMessage> {
    console.log(`Sending message to mock Gemini service: ${message}`);
    
    // Store the message in history if provided
    if (history) {
      this.messageHistory = [...history];
    }
    
    // Add user message to history
    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };
    
    this.messageHistory.push(userMessage);
    
    // Generate a mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        const response: AIMessage = {
          role: 'assistant',
          content: `This is a mock response to: "${message}"`,
          timestamp: Date.now()
        };
        
        this.messageHistory.push(response);
        resolve(response);
      }, 1000);
    });
  }

  clearHistory(): void {
    console.log('Clearing chat history in mock Gemini service');
    this.messageHistory = [];
  }
}
