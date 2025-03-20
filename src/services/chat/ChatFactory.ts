
import { ChatService, ChatServiceOptions, GeminiChatService } from './messageTypes';

// Chat service types enum
export enum ChatServiceType {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  MOCK = 'mock',
  COPILOT = 'copilot'
}

// Mock chat service implementation
class MockChatService implements ChatService {
  private messages: { role: 'user' | 'assistant' | 'system', content: string }[] = [];
  
  async sendMessage(message: string): Promise<any> {
    // Add user message
    this.messages.push({ role: 'user', content: message });
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock response
    const response = `This is a mock response to: "${message}"`;
    this.messages.push({ role: 'assistant', content: response });
    
    return { text: response, messages: this.messages };
  }
  
  clearHistory(): void {
    this.messages = [];
  }
}

// Gemini chat service implementation (stub)
class GeminiChatServiceImpl implements GeminiChatService {
  private apiKey: string;
  private messages: { role: 'user' | 'assistant' | 'system', content: string }[] = [];
  
  constructor(options: ChatServiceOptions) {
    this.apiKey = options.apiKey;
  }
  
  async sendMessage(message: string, history?: any[]): Promise<any> {
    // In a real implementation, this would call the Gemini API
    console.log('Sending message to Gemini:', message);
    console.log('API Key:', this.apiKey);
    
    // Add user message
    this.messages.push({ role: 'user', content: message });
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock response for now
    const response = `This is a Gemini AI response to: "${message}"`;
    this.messages.push({ role: 'assistant', content: response });
    
    return { text: response, messages: this.messages };
  }
  
  async sendMultiModalMessage(message: string, images: { data: string, mimeType: string }[]): Promise<any> {
    console.log('Sending multimodal message to Gemini:', message);
    console.log('With images:', images.length);
    
    // Add user message
    this.messages.push({ role: 'user', content: message + ' (with image)' });
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock response for now
    const response = `I've analyzed your image and here's my response to: "${message}"`;
    this.messages.push({ role: 'assistant', content: response });
    
    return { text: response, messages: this.messages };
  }
  
  async streamMessage(message: string, callback: (chunk: string) => void): Promise<any> {
    // Add user message
    this.messages.push({ role: 'user', content: message });
    
    // Simulate streaming by sending chunks with delays
    const responseChunks = [
      "I'm thinking",
      " about your question...",
      " Here's my response:",
      " This is a streamed",
      " response from the Gemini",
      " AI model."
    ];
    
    for (const chunk of responseChunks) {
      await new Promise(resolve => setTimeout(resolve, 500));
      callback(chunk);
    }
    
    const fullResponse = responseChunks.join('');
    this.messages.push({ role: 'assistant', content: fullResponse });
    
    return { text: fullResponse, messages: this.messages };
  }
  
  clearHistory(): void {
    this.messages = [];
  }
}

// Chat factory class
export class ChatFactory {
  static createChatService(type: ChatServiceType, options: ChatServiceOptions): ChatService {
    switch (type) {
      case ChatServiceType.GEMINI:
        return new GeminiChatServiceImpl(options);
      case ChatServiceType.MOCK:
        return new MockChatService();
      default:
        console.warn(`Chat service type "${type}" not implemented, using mock service.`);
        return new MockChatService();
    }
  }
}
