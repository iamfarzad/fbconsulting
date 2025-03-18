
import { initializeGemini } from './initialize';
import { formatMessagesForSDK, convertPartsToContent } from './formatters';
import { GeminiMessage, GeminiConfig } from './types';

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
