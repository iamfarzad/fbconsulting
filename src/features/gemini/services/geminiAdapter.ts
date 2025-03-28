
// Simple adapter for Gemini API calls

export interface GenAIRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenAIResponse {
  text: string;
  error?: string;
}

export class GeminiAdapter {
  static async generateResponse(request: GenAIRequest): Promise<GenAIResponse> {
    try {
      const { prompt, model = 'gemini-2.0-pro' } = request;
      
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return { text: data.text };
      
    } catch (error) {
      console.error('Error in GeminiAdapter:', error);
      return { 
        text: 'Sorry, I encountered an error processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Test connection to the API
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Re-export as default for compatibility
export default GeminiAdapter;
