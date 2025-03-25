export interface GoogleGenAIConfig {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

// Export the test connection function
export const testGoogleGenAIConnection = async (apiKey: string): Promise<boolean> => {
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
};

export class GoogleGenAIAdapter {
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

  async generateResponse(prompt: string) {
    try {
      const response = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Adapter error:', error);
      throw error;
    }
  }
}
