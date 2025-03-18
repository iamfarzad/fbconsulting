
import { useState } from 'react';
import { sendGeminiChatRequest, convertToGeminiMessages, GeminiConfig } from '@/services/gemini';
import { AIMessage } from '@/services/chat/messageTypes';

interface UseMessageHandlerProps {
  messages: AIMessage[];
  apiKey: string | null;
  addMessage: (message: AIMessage) => void;
  setLoadingState: (loading: boolean) => void;
  handleError: (error: string) => void;
  getSystemPrompt?: () => string | undefined;
  modelName?: string;
}

export const useMessageHandler = ({
  messages,
  apiKey,
  addMessage,
  setLoadingState,
  handleError,
  getSystemPrompt,
  modelName = 'gemini-1.5-pro'
}: UseMessageHandlerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const sendMessage = async (content: string) => {
    if (isGenerating) return;
    if (!content.trim()) return;
    
    // Add the user message to the messages array
    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };
    addMessage(userMessage);
    
    setIsGenerating(true);
    setLoadingState(true);
    
    try {
      if (!apiKey) {
        throw new Error('API key is missing. Please set your API key in the settings.');
      }
      
      const systemPrompt = getSystemPrompt?.();
      const geminiMessages = convertToGeminiMessages(messages.concat(userMessage), systemPrompt);
      
      // Create config with API key and model name
      const config: GeminiConfig = {
        apiKey,
        model: modelName
      };
      
      // Send the messages to the Gemini API
      const response = await sendGeminiChatRequest(geminiMessages, config);
      
      // Add the AI's response to the messages array
      addMessage({
        role: 'assistant',
        content: response || 'I apologize, but I was unable to generate a response.',
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      handleError(error instanceof Error ? error.message : 'Unknown error sending message');
    } finally {
      setIsGenerating(false);
      setLoadingState(false);
    }
  };

  return { sendMessage };
};
