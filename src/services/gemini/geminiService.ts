
import { 
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
  EnhancedGenerateContentResponse
} from '@google/genai';

// Types for Gemini message formats
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

// Default configuration for Gemini chat
const DEFAULT_CONFIG: GeminiGenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

/**
 * Sends a chat request to the Gemini API using the official SDK
 */
export async function sendGeminiChatRequest(
  messages: GeminiMessage[],
  apiKey: string,
  config: Partial<GeminiGenerationConfig> = {}
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is not available');
  }

  // Initialize the Gemini API
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-001" });

  try {
    // Format the history for the SDK chat format
    const formattedHistory = formatMessagesForChat(messages.slice(0, -1));
    
    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        ...DEFAULT_CONFIG,
        ...config,
      },
    });
    
    // Send the last message to get a response
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(formatMessageContent(lastMessage));
    
    // Extract the response text
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Format messages for the chat history
 */
function formatMessagesForChat(messages: GeminiMessage[]) {
  return messages.map(msg => ({
    role: msg.role,
    parts: formatParts(msg.parts)
  }));
}

/**
 * Format a single message's content for sendMessage
 */
function formatMessageContent(message: GeminiMessage) {
  return formatParts(message.parts);
}

/**
 * Format parts array to the format expected by the API
 */
function formatParts(parts: any[]) {
  return parts.map(part => {
    if (part.text) {
      return { text: part.text };
    } else if (part.inlineData) {
      return {
        inlineData: {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data
        }
      };
    }
    return { text: "" };
  });
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
