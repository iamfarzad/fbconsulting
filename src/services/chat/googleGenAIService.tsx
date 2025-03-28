import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
// Note: In production, this should be an environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || "");

// Default model to use
const defaultModel = "gemini-pro";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatService {
  sendMessage: (message: string, history: ChatMessage[]) => Promise<string>;
}

/**
 * Creates and returns a chat service using Google's Generative AI
 */
export function getChatService(): ChatService {
  return {
    sendMessage: async (message: string, history: ChatMessage[]) => {
      try {
        // Create a chat session with the model
        const model = genAI.getGenerativeModel({ model: defaultModel });
        const chat = model.startChat({
          history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          }))
        });

        // Send the message to the chat
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        return text;
      } catch (error) {
        console.error("Error sending message to Google GenAI:", error);
        return "Sorry, I encountered an error processing your request.";
      }
    }
  };
}
