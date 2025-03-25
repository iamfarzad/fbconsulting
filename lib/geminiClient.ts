import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiClient {
  private apiKey: string;
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async sendPrompt(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in sendPrompt:', error);
      throw new Error('Failed to generate response');
    }
  }

  async streamPrompt(prompt: string, onData: (data: string) => void): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContentStream(prompt);

      for await (const chunk of result) {
        onData(chunk.text());
      }
    } catch (error) {
      console.error('Error in streamPrompt:', error);
      throw new Error('Failed to stream response');
    }
  }

  async generateAudio(text: string, voiceId: string = 'default', languageCode: string = 'en-US'): Promise<ReadableStream> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateAudio({
        text,
        voiceId,
        languageCode
      });

      return result.audioStream();
    } catch (error) {
      console.error('Error in generateAudio:', error);
      throw new Error('Failed to generate audio');
    }
  }
}

export default GeminiClient;
