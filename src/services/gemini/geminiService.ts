
import { 
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
  Content,
  EnhancedGenerateContentResponse,
  GenerationConfig,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold
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

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  stopSequences?: string[];
  safetySettings?: SafetySetting[];
}

// Default configuration for Gemini chat
const DEFAULT_CONFIG: Partial<GenerationConfig> = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
};

// Default safety settings
const DEFAULT_SAFETY_SETTINGS: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Initialize the Gemini API with the specified configuration
 */
export function initializeGemini(config: GeminiConfig): GenerativeModel {
  if (!config.apiKey) {
    throw new Error('Gemini API key is required');
  }
  
  const genAI = new GoogleGenerativeAI(config.apiKey);
  return genAI.getGenerativeModel({ 
    model: config.model || "gemini-2.0-pro-001",
    generationConfig: {
      temperature: config.temperature ?? DEFAULT_CONFIG.temperature,
      topP: config.topP ?? DEFAULT_CONFIG.topP,
      topK: config.topK ?? DEFAULT_CONFIG.topK,
      maxOutputTokens: config.maxOutputTokens ?? DEFAULT_CONFIG.maxOutputTokens,
      stopSequences: config.stopSequences ?? DEFAULT_CONFIG.stopSequences,
    },
    safetySettings: config.safetySettings ?? DEFAULT_SAFETY_SETTINGS,
  });
}

/**
 * Sends a chat request to the Gemini API using the official SDK
 */
export async function sendGeminiChatRequest(
  messages: GeminiMessage[],
  config: GeminiConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini model
    const model = initializeGemini(config);
    
    // Format the history for the SDK chat format
    const formattedHistory = formatMessagesForSDK(messages.slice(0, -1));
    
    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    // Send the last message to get a response
    const lastMessage = messages[messages.length - 1];
    const formattedContent = convertPartsToContent(lastMessage.parts);
    
    const result = await chat.sendMessage(formattedContent);
    
    // Extract the response text
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Format messages for the Gemini SDK chat history format
 */
function formatMessagesForSDK(messages: GeminiMessage[]): Content[] {
  return messages.map(msg => ({
    role: msg.role,
    parts: msg.parts.map(part => {
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
    })
  }));
}

/**
 * Convert parts array to the format expected by the Gemini SDK
 */
function convertPartsToContent(parts: any[]): Part[] {
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
 * Send a multimodal request to Gemini (text + images)
 */
export async function sendMultimodalRequest(
  text: string,
  images: { mimeType: string, data: string }[],
  config: GeminiConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini vision model
    const model = initializeGemini({
      ...config,
      model: "gemini-2.0-vision-001" // Use the vision model for multimodal
    });
    
    // Create a content array with text and images
    const parts: Part[] = [
      { text },
      ...images.map(img => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      }))
    ];
    
    const result = await model.generateContent(parts);
    return result.response.text();
  } catch (error) {
    console.error('Error sending multimodal request to Gemini:', error);
    throw error;
  }
}

/**
 * Stream chat responses from Gemini
 */
export async function streamGeminiChat(
  messages: GeminiMessage[],
  config: GeminiConfig,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!config.apiKey) {
    throw new Error('Gemini API key is not available');
  }

  try {
    // Initialize the Gemini model
    const model = initializeGemini(config);
    
    // Format the history for the SDK chat format
    const formattedHistory = formatMessagesForSDK(messages.slice(0, -1));
    
    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });
    
    // Send the last message to get a response
    const lastMessage = messages[messages.length - 1];
    const formattedContent = convertPartsToContent(lastMessage.parts);
    
    const result = await chat.sendMessageStream(formattedContent);
    
    // Process chunks as they arrive
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error) {
    console.error('Error streaming from Gemini API:', error);
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
