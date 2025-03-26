interface GenerateContentResponse {
  text: () => string;
}

interface GeminiModel {
  generateContent: (prompt: string) => Promise<GenerateContentResponse>;
}

export interface GoogleGenAIConfig {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export class GeminiAdapter {
  private initialized = false;
  private model: GeminiModel;

  constructor() {
    this.model = {
      generateContent: async () => {
        throw new Error('Model not initialized');
      }
    };
  }

  async initialize(): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize Gemini');
      }

      this.model = {
        generateContent: async (prompt: string) => {
          const response = await fetch('/api/gemini/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
          });

          if (!response.ok) {
            throw new Error('Failed to generate content');
          }

          const data = await response.json();
          return {
            text: () => data.text
          };
        }
      };

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Initialization failed:', error);
      this.initialized = false;
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('Adapter not initialized');
    }

    try {
      const response = await this.model.generateContent(prompt);
      return response.text();
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const testGoogleGenAIConnection = async (apiKey: string): Promise<boolean> => {
  const adapter = new GeminiAdapter();
  return adapter.testConnection(apiKey);
};
