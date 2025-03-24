import { PersonaData } from '@/types/persona';
import { GeminiRequest, GeminiResponse } from '../gemini/types';

export interface ChatMessage {
  timestamp: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GoogleGenAIChatServiceConfig {
  apiKey: string;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  interest?: string;
}

export class GoogleGenAIChatService {
  private config: GoogleGenAIChatServiceConfig;
  private history: ChatMessage[];

  constructor(config: GoogleGenAIChatServiceConfig) {
    this.config = config;
    this.history = [];
  }

  public async initializeChat(personaData: PersonaData): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: this.config.apiKey,
          model: this.config.modelName,
          config: this.config
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize chat');
      }

      if (personaData) {
        await this.addSystemMessage(personaData);
      }

      return true;
    } catch (error) {
      console.error('Error initializing chat:', error);
      return false;
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: this.config.apiKey,
          model: this.config.modelName
        })
      });

      if (!response.ok) {
        throw new Error('Connection test failed');
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  private async addSystemMessage(personaData: PersonaData): Promise<void> {
    const systemMessage: ChatMessage = {
      timestamp: Date.now(),
      role: 'system',
      content: this.generateSystemPrompt(personaData)
    };
    this.history.push(systemMessage);
  }

  private generateSystemPrompt(personaData: PersonaData): string {
    const { personaDefinitions, currentPersona, userRole, userIndustry, userTechnicalLevel } = personaData;
    const persona = currentPersona ? personaDefinitions[currentPersona] : null;
    
    // Map technical level to more descriptive terms for the prompt
    const technicalLevelDescriptions = {
      'beginner': 'basic understanding of concepts',
      'intermediate': 'solid understanding of concepts and some practical experience',
      'expert': 'deep technical knowledge and extensive experience'
    };

    const technicalLevelDescription = userTechnicalLevel ? 
      technicalLevelDescriptions[userTechnicalLevel] : 
      technicalLevelDescriptions.beginner;

    return `You are an AI assistant with the following characteristics:
${persona ? `Name: ${persona.name}
Tone: ${persona.tone}
Focus Areas: ${persona.focusAreas.join(', ')}` : ''}

User Context:
- Role: ${userRole || 'Unknown'}
- Industry: ${userIndustry || 'Unknown'}
- Technical Level: ${technicalLevelDescription}

Please adjust your responses accordingly.`;
  }

  public async sendMessage(message: string, leadInfo?: LeadInfo): Promise<string> {
    try {
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          history: this.history,
          config: this.config
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { text } = await response.json();
      
      // Add messages to history
      this.history.push({
        timestamp: Date.now(),
        role: 'user',
        content: message
      });

      this.history.push({
        timestamp: Date.now(),
        role: 'assistant',
        content: text
      });

      return text;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private async handleChatResponse(message: string, responseText: string, leadInfo?: LeadInfo): Promise<string> {
    try {
      // Add message to history
      this.history.push({
        timestamp: Date.now(),
        role: 'assistant',
        content: responseText
      });

      // If we have lead information and the conversation is ending, send an email summary
      if (leadInfo && await this.isConversationEnding(message, responseText)) {
        await this.sendConversationSummary(leadInfo);
      }

      return responseText;
    } catch (error) {
      console.error('Error handling chat response:', error);
      throw error;
    }
  }

  private async isConversationEnding(message: string, response: string): Promise<boolean> {
    const endingPatterns = [
      /goodbye/i,
      /thank.*you/i,
      /bye/i,
      /that.*all/i,
      /end.*conversation/i
    ];

    return endingPatterns.some(pattern => 
      pattern.test(message.toLowerCase()) || 
      pattern.test(response.toLowerCase())
    );
  }

  private async sendConversationSummary(leadInfo: LeadInfo): Promise<void> {
    // Implementation for sending conversation summary
    // This would typically integrate with your email service
    console.log('Sending conversation summary for:', leadInfo);
  }

  public getHistory(): ChatMessage[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }
}

export class GoogleGenAIService {
  async generateContent(prompt: string, options?: { images?: any[] }) {
    try {
      const request: GeminiRequest = {
        prompt,
        images: options?.images
      };

      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data: GeminiResponse = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw error;
    }
  }
}

let chatServiceInstance: GoogleGenAIChatService | null = null;

export function getChatService(config?: GoogleGenAIChatServiceConfig): GoogleGenAIChatService {
  if (!chatServiceInstance && config) {
    chatServiceInstance = new GoogleGenAIChatService(config);
  }
  if (!chatServiceInstance) {
    throw new Error('Chat service not initialized');
  }
  return chatServiceInstance;
}
