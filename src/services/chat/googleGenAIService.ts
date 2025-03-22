import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { PersonaData } from '@/types/persona';

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
  private genClient: GoogleGenerativeAI | null;
  private model: GenerativeModel | null;

  constructor(config: GoogleGenAIChatServiceConfig) {
    this.config = config;
    this.history = [];
    this.genClient = null;
    this.model = null;
  }

  public async initializeChat(personaData: PersonaData): Promise<boolean> {
    try {
      // Initialize Gemini client
      this.genClient = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genClient.getGenerativeModel({
        model: this.config.modelName,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxOutputTokens,
          topP: this.config.topP,
          topK: this.config.topK
        }
      });
      
      // Add initial system message if persona data is provided
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
      if (!this.genClient) {
        this.genClient = new GoogleGenerativeAI(this.config.apiKey);
      }
      const model = this.genClient.getGenerativeModel({ model: this.config.modelName });
      const result = await model.generateContent('test');
      return result !== null;
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

  private async handleRetryResponse(message: string, retryResponseText: string): Promise<string> {
    try {
      // Add retry response to history
      this.history.push({
        timestamp: Date.now(),
        role: 'assistant',
        content: retryResponseText
      });

      return retryResponseText;
    } catch (error) {
      console.error('Error handling retry response:', error);
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
}
