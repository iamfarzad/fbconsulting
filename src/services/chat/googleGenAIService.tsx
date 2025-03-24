import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GoogleGenAIChatServiceConfig {
  apiKey: string;
  temperature?: number;
  topK?: number;
  topP?: number;
}

export class GoogleGenAIChatService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(config: GoogleGenAIChatServiceConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage([{ text: messages[messages.length - 1].content }]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }
}

export function getChatService(config: GoogleGenAIChatServiceConfig) {
  return new GoogleGenAIChatService(config);
}
