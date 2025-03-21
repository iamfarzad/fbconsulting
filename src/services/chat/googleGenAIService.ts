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

// Re-export ChatMessage type to be used in other modules
export type { ChatMessage } from '../copilot/types';

// Chat service configuration
export type GoogleGenAIChatServiceConfig = GoogleGenAIConfig & {
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

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

  private trimHistory() {
    if (this.history.length > this.maxHistoryLength) {
      this.history = this.history.slice(-this.maxHistoryLength);
    }
  }

  constructor(config: GoogleGenAIChatServiceConfig) {
    // Validate API key
    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    const trimmedKey = config.apiKey.trim();
    if (trimmedKey === '') {
      throw new Error('API key cannot be empty');
    }

    // Store sanitized config
    this.config = {
      modelName: config.modelName || 'gemini-2.0-flash',
      temperature: config.temperature ?? 0.9,
      maxOutputTokens: config.maxOutputTokens ?? 2048,
      topP: config.topP ?? 1.0,
      topK: config.topK ?? 1,
      apiKey: trimmedKey
    };

    try {
      // Log initialization attempt (without sensitive data)
      console.log('Initializing Google Gen AI with config:', {
        modelName: this.config.modelName,
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens,
        topP: this.config.topP,
        topK: this.config.topK,
        apiKeyPresent: !!this.config.apiKey
      });

      // Initialize the API client
      this.ai = new GoogleGenerativeAI(config.apiKey);
      
      // Initialize the model
      this.model = this.ai.getGenerativeModel({
        model: 'gemini-2.0-flash'
      });

      // Start a chat session
      this.chat = this.model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048
        }
      });

      // Test the connection
      (async () => {
        try {
          const result = await this.chat.sendMessage("Hi");
          if (!result.response) {
            throw new Error('Model initialization test failed');
          }

          // Initialize chat
          await this.initializeChat();
          console.log('Successfully initialized Google Gen AI');
        } catch (error) {
          console.error('Error during async initialization:', error);
          throw error;
        }
      })();
      
      console.log('Successfully initialized Google Gen AI');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('Failed to initialize:', errorMessage);
      throw new Error(`Failed to initialize chat service: ${errorMessage}`);
    }
  }

  /**
   * Initialize or reinitialize the chat session
   * @param personaData Optional persona data to initialize with system instructions
   */
  public async initializeChat(personaData?: PersonaData): Promise<void> {
    try {
      // Initialize the chat model with support for multimodal capabilities
      this.model = this.ai.getGenerativeModel({
        model: this.config.modelName,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxOutputTokens,
          topP: this.config.topP,
          topK: this.config.topK
        },
        // Additional configurations for multimodal capabilities
        systemInstruction: {
          role: 'system',
          parts: [{ text: 'You are a helpful assistant that can process text, images, and audio.' }]
        }
      });

      this.chat = this.model.startChat();

      // Initialize history with system prompt if persona data is provided
      if (personaData) {
        const systemPrompt = await this.generateSystemPrompt(personaData);
        this.history = [{
          role: 'system',
          content: systemPrompt,
          timestamp: Date.now()
        }];
      } else {
        this.history = [];
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      throw error;
    }
  }

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
    return userEndingPhrases.some(phrase => userMessage.toLowerCase().includes(phrase));
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
      this.history.push({
        timestamp: Date.now(),
        role: 'user',
        content: message
      });

      try {
        console.log('Sending message:', message);
        const result = await this.chat.sendMessage(message);
        const responseText = result.response && typeof result.response.text === 'function'
            ? await result.response.text()
            : '';

        this.history.push({
          timestamp: Date.now(), role: 'assistant', content: responseText 
        });

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
            timestamp: Date.now(), role: 'assistant', content: retryResponseText 
          });

          return retryResponseText;
        } catch (retryError) {
          console.error('Retry failed, reinitializing chat...', retryError);
          await this.initializeChat();
        }
      }

      return 'Chat service is currently unavailable.';
    } catch (error) {
      console.error('Error sending message to Google Gen AI:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  /**
   * Get the current chat history
   */
  public getHistory(): ChatMessage[] {
    return [...this.history];
  }

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
}
