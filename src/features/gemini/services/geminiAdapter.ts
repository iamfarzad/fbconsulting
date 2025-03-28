
import { AIMessage, MessageRole } from '../types';

export interface GenAIRequest {
  prompt: string;
  model?: string;
  images?: { mimeType: string; data: string }[];
  systemInstruction?: string;
}

export interface GenAIResponse {
  text: string;
  error?: string;
}

/**
 * GeminiAdapter provides methods for interacting with the Gemini API
 */
export class GeminiAdapter {
  private static apiKey: string | null = null;

  /**
   * Initialize the adapter with an API key
   */
  public static initialize(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Check if the adapter has been initialized with an API key
   */
  public static isInitialized(): boolean {
    return !!this.apiKey;
  }

  /**
   * Generate a response using the Gemini API
   */
  public static async generateResponse(request: GenAIRequest): Promise<GenAIResponse> {
    try {
      // Check if we have an API key
      if (!this.apiKey) {
        console.warn("No API key provided. Using mock response.");
        return this.generateMockResponse(request.prompt);
      }

      // If this is a multimodal request with images
      if (request.images && request.images.length > 0) {
        return this.generateMultimodalResponse(request);
      }

      // Regular text-only request
      return this.generateTextResponse(request);
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        text: "I'm sorry, I encountered an error processing your request.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Generate a text-only response
   */
  private static async generateTextResponse(request: GenAIRequest): Promise<GenAIResponse> {
    try {
      // In a real implementation, this would call the Gemini API
      // For now, we'll just return a mock response
      console.log("Sending text request to Gemini API:", request);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return this.generateMockResponse(request.prompt);
    } catch (error) {
      console.error("Error generating text response:", error);
      return {
        text: "Sorry, I couldn't process your text request at this time.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Generate a response with text and images
   */
  private static async generateMultimodalResponse(request: GenAIRequest): Promise<GenAIResponse> {
    try {
      // In a real implementation, this would call the Gemini API's multimodal endpoint
      console.log("Sending multimodal request to Gemini API:", {
        prompt: request.prompt,
        imageCount: request.images?.length || 0
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        text: `I've analyzed the ${request.images?.length} image(s) you sent. ${this.generateMockResponse(request.prompt).text}`
      };
    } catch (error) {
      console.error("Error generating multimodal response:", error);
      return {
        text: "Sorry, I couldn't process your image-based request at this time.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Generate a mock response for testing purposes
   */
  private static generateMockResponse(prompt: string): GenAIResponse {
    // Simple mock response generator
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes("hello") || promptLower.includes("hi")) {
      return { text: "Hello! How can I help you today?" };
    }
    
    if (promptLower.includes("help") || promptLower.includes("?")) {
      return { 
        text: "I'd be happy to help! I can answer questions, provide information, or assist with various tasks. What would you like to know?" 
      };
    }
    
    if (promptLower.includes("feature") || promptLower.includes("service")) {
      return { 
        text: "Our AI services include natural language processing, image recognition, and automated content generation. These features can help streamline your workflows and enhance user experiences." 
      };
    }
    
    return { 
      text: "Thank you for your message. I'm a Gemini AI assistant here to help with information and tasks. How else can I assist you today?" 
    };
  }

  /**
   * Convert chat messages to history format
   */
  public static formatMessagesForAPI(messages: AIMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}
