<<<<<<< HEAD
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { LeadInfo } from '@/types';
import { PersonaData } from '@/mcp/protocols/personaManagement/types';
import { leadCaptureService } from '../lead/leadCaptureService';
import { emailService } from '../email/emailService';
import type { 
  GoogleGenAIConfig,
  SpatialContext,
  VoiceConfig,
  ChatMessage,
  AgenticConfig
} from '../copilot/types';
=======
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { PersonaData } from '@/types/persona';

export interface ChatMessage {
  timestamp: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
>>>>>>> fix-technical-level-types

export interface GoogleGenAIChatServiceConfig {
  apiKey: string;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

<<<<<<< HEAD
/**
 * Google GenAI service for chat
 */
class GoogleGenAIChatService implements GeminiChatService {
  private apiKey: string;
  private config: GoogleGenAIChatServiceConfig;
  private ai: GoogleGenerativeAI;
  private model: GenerativeModel;
  private chat: ChatSession;
  private history: ChatMessage[] = [];
  private maxHistoryLength: number = 50;
=======
export interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  interest?: string;
}
>>>>>>> fix-technical-level-types

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

<<<<<<< HEAD
  /**
   * Determines if a conversation is likely ending based on the content of messages
   * @param userMessage The user's message
   * @param assistantResponse The assistant's response
   * @returns True if the conversation appears to be ending
   */
  private isConversationEnding(userMessage: string, assistantResponse: string): boolean {
    const userEndingPhrases = [
      'thank you', 'thanks', 'bye', 'goodbye', 'see you', 'talk to you later',
      'that\'s all', 'that is all', 'that\'s it', 'that is it'
    ];
    
    const assistantEndingPhrases = [
      'thank you for contacting', 'have a great day', 'feel free to reach out',
      'don\'t hesitate to contact', 'please let me know if', 'is there anything else'
    ];
    
    const userMessageLower = userMessage.toLowerCase();
    const assistantResponseLower = assistantResponse.toLowerCase();
    
    const userEnding = userEndingPhrases.some(phrase => userMessageLower === phrase);
    const assistantEnding = assistantEndingPhrases.some(phrase => assistantResponseLower === phrase);
    
    return userEnding || assistantEnding;
  }

  private async generateSystemPrompt(personaData: PersonaData): Promise<string> {
    if (!personaData || !personaData.personaDefinitions) {
      throw new Error('Persona data is missing or invalid');
    }
    const currentPersona = personaData.currentPersona;
    const personaDetails = personaData.personaDefinitions[currentPersona];
    
    return `
      You are Farzad AI Assistant, an AI consultant built into the landing page of F.B Consulting. 
      Currently using the "${personaDetails.name}" persona.
      
      Tone: ${personaDetails.tone}
      
      Focus Areas:
      ${personaDetails.focusAreas.map(area => `- ${area}`).join('\n')}
      
      Additional Context:
      - User Role: ${personaData.userRole || 'Unknown'}
      - User Industry: ${personaData.userIndustry || 'Unknown'}
      - User Technical Level: ${personaData.userTechnicalLevel || 'beginner'}
      - Current Page: ${personaData.currentPage || '/'}
      
      Remember to adjust your responses based on the user's technical level and industry context.
      
      When appropriate, you can include special card formats in your responses using this syntax:
      [[CARD:type:title:description:style]]
      
      For example:
      [[CARD:services:AI Strategy Consulting:I help businesses identify opportunities for AI integration:bordered]]
    `;
  }

  /**
   * Synthesize speech using Gemini's Multimodal Live API
   */
  // Cache for audio responses
  private audioCache: Map<string, { data: ArrayBuffer; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 3600000; // 1 hour in milliseconds

  private getCacheKey(text: string, quality: string): string {
    return `${text}:${quality}`;
  }

  // Performance metrics
  private metrics = {
    totalRequests: 0,
    cacheHits: 0,
    errors: 0,
    avgResponseTime: 0
  };

  private logMetrics(startTime: number, cacheHit: boolean, error?: Error) {
    const duration = Date.now() - startTime;
    this.metrics.totalRequests++;
    if (cacheHit) this.metrics.cacheHits++;
    if (error) this.metrics.errors++;
    
    // Update average response time
    this.metrics.avgResponseTime = (
      (this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + duration) /
      this.metrics.totalRequests
    );

    // Log metrics
    console.info('Speech Synthesis Metrics:', {
      ...this.metrics,
      lastRequestDuration: duration,
      cacheHitRate: (this.metrics.cacheHits / this.metrics.totalRequests * 100).toFixed(1) + '%',
      errorRate: (this.metrics.errors / this.metrics.totalRequests * 100).toFixed(1) + '%'
    });
  }

  private async synthesizeSpeech(text: string, voiceConfig: VoiceConfig): Promise<void> {
    const startTime = Date.now();
    try {
      // Determine quality based on network speed
      const connection = (navigator as any).connection;
      let quality = 'medium';
      if (connection) {
        if (connection.effectiveType === '4g') quality = 'high';
        if (connection.effectiveType === '3g') quality = 'medium';
        if (['2g', 'slow-2g'].includes(connection.effectiveType)) quality = 'low';
      }

      // Check cache
      const cacheKey = this.getCacheKey(text, quality);
      const cached = this.audioCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        await this.playAudio(cached.data);
        this.logMetrics(startTime, true);
        return;
      }

      // Call Vercel serverless function
      const response = await fetch('/api/gemini_audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          quality,
          role: 'user'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to synthesize speech');
      }

      // Get audio data from response
      const audioData = await response.arrayBuffer();

      // Log server metrics
      const serverResponseTime = response.headers.get('X-Response-Time');
      const cacheStatus = response.headers.get('X-Cache');
      console.info('Server Metrics:', {
        responseTime: serverResponseTime,
        cacheStatus,
        contentLength: audioData.byteLength
      });

      // Cache the response
      this.audioCache.set(cacheKey, {
        data: audioData,
        timestamp: Date.now()
      });

      // Clean old cache entries
      for (const [key, value] of this.audioCache.entries()) {
        if (Date.now() - value.timestamp > this.CACHE_DURATION) {
          this.audioCache.delete(key);
        }
      }

      // Play the audio
      await this.playAudio(audioData);
      this.logMetrics(startTime, false);

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

  private updateSpatialContext(context: Partial<SpatialContext>): void {
    this.spatialContext = {
      ...this.spatialContext,
      ...context,
      timestamp: Date.now()
    } as SpatialContext;
  }

  private async handleProactiveAssistance(): Promise<void> {
    if (!this.config.agentic?.proactiveAssistance) return;

    const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;
    const inactivityThreshold = 60000; // 1 minute

    if (timeSinceLastInteraction > inactivityThreshold) {
      const context = this.spatialContext;
      if (context) {
        // Generate proactive suggestion based on context
        const suggestion = await this.model.generateContent(
          `Based on the user being in ${context.pageSection} and ${context.userBehavior}, what would be helpful to suggest?`
        );
        
        if (suggestion) {
          this.history.push({
        timestamp: Date.now(),
            role: 'assistant',
            content: suggestion.response.text()
          });

          const responseText = suggestion.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (this.config.voice?.enabled && responseText) {
            await this.synthesizeSpeech(responseText, this.config.voice);
          }
        }
      }
    }
  }

  public async sendMessage(message: string, leadInfo?: LeadInfo): Promise<string> {
    try {
      // Check for lead information in the message
      if (!leadInfo) {
        const extractedLeadInfo = leadCaptureService.extractLeadInfo(message);
        if (extractedLeadInfo) {
          leadInfo = extractedLeadInfo;
          // Capture the lead information
          leadCaptureService.captureLead(extractedLeadInfo).catch(error => {
            console.error('Error capturing lead:', error);
          });
        }
      }

      // Add user message to history
=======
  private async handleRetryResponse(message: string, retryResponseText: string): Promise<string> {
    try {
      // Add retry response to history
>>>>>>> fix-technical-level-types
      this.history.push({
        timestamp: Date.now(),
        role: 'assistant',
        content: retryResponseText
      });

<<<<<<< HEAD
      try {
        console.log('Sending message:', message);
        const result = await this.chat.sendMessage(message);
        const responseText = result.response && typeof result.response.text === 'function'
            ? await result.response.text()
            : '';

        this.history.push({
        timestamp: Date.now(), role: 'assistant', content: responseText });

        // If we have lead information and the conversation is ending, send an email summary
        if (leadInfo && this.isConversationEnding(message, responseText)) {
          emailService.sendConversationSummary(leadInfo, this.history).catch(error => {
            console.error('Error sending conversation summary:', error);
          });
        }

        return responseText;
      } catch (error) {
        console.error('Error sending message, retrying once...', error);

        try {
          const retryResult = await this.chat.sendMessage(message);
          const retryResponseText = retryResult.response && typeof retryResult.response.text === 'function'
              ? await retryResult.response.text()
              : '';

          this.history.push({
        timestamp: Date.now(), role: 'assistant', content: retryResponseText });

=======
>>>>>>> fix-technical-level-types
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
<<<<<<< HEAD

  /**
   * Clear the chat history
   */
  public async clearHistory(personaData: PersonaData): Promise<void> {
    if (!personaData) {
      throw new Error('Cannot clear history without persona data.');
    }
    const systemPrompt = await this.generateSystemPrompt(personaData);
    this.history = [{
      role: 'system',
      content: systemPrompt,
      timestamp: Date.now()
    }];
  }

  /**
   * Test connection to the API
   */
  public async testConnection(): Promise<boolean> {
    try {
      console.log('Testing connection with model:', this.config.modelName);

      if (!this.model || !this.chat) {
        console.error('Model or chat session not initialized');
        return false;
      }

      // Test with a simple prompt
      const result = await this.chat.sendMessage('Hi');
      const response = await result.response;
      const text = response.text();
      
      console.log('Test connection successful. Response:', text);
      return true;
    } catch (error) {
      console.error('Connection test failed:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorStack: error instanceof Error ? error.stack : undefined,
        config: {
          modelName: this.config.modelName,
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxOutputTokens
        }
      });
      return false;
    }
  }
=======
>>>>>>> fix-technical-level-types
}
