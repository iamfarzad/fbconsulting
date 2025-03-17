
// Types for Gemini API requests and responses
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }[];
}

export interface GeminiGenerationConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  stopSequences?: string[];
}

export interface GeminiChatRequest {
  contents: GeminiMessage[];
  generationConfig?: GeminiGenerationConfig;
  safetySettings?: any[];
}

export interface GeminiChatResponse {
  candidates: {
    content: {
      role: string;
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
    safetyRatings: any[];
  }[];
  promptFeedback: {
    safetyRatings: any[];
  };
}

// Default configuration for Gemini chat
const DEFAULT_CONFIG: GeminiGenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

/**
 * Sends a chat request to the Gemini API
 */
export async function sendGeminiChatRequest(
  messages: GeminiMessage[],
  apiKey: string,
  config: Partial<GeminiGenerationConfig> = {}
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is not available');
  }

  console.log('Starting Gemini API request with key length:', apiKey.length);

  // Construct the request payload
  const payload: GeminiChatRequest = {
    contents: messages,
    generationConfig: {
      ...DEFAULT_CONFIG,
      ...config,
    },
  };

  try {
    // Call the Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiChatResponse = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates.length > 0) {
      const textResponse = data.candidates[0].content.parts[0].text;
      return textResponse || '';
    }
    
    console.error('No text found in Gemini response:', data);
    return 'Sorry, I could not generate a response at this time.';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Converts AIMessages to Gemini message format
 */
export function convertToGeminiMessages(messages: any[], systemPrompt?: string): GeminiMessage[] {
  const geminiMessages: GeminiMessage[] = [];
  
  // Add system prompt as a user message if provided
  if (systemPrompt) {
    geminiMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    // Add a placeholder model response to maintain conversation flow
    geminiMessages.push({
      role: 'model',
      parts: [{ text: 'I understand and will follow these instructions.' }]
    });
  }
  
  // Convert the rest of the messages
  messages.forEach((msg: any) => {
    if (msg.role === 'user' || msg.role === 'assistant') {
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }
  });
  
  return geminiMessages;
}
