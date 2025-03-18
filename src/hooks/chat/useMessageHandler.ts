
import { useCallback } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { sendGeminiChatRequest, convertToGeminiMessages } from '@/services/gemini/geminiService';

interface UseMessageHandlerProps {
  messages: AIMessage[];
  apiKey: string | null;
  addMessage: (message: AIMessage) => void;
  setLoadingState: (loading: boolean) => void;
  handleError: (error: string) => void;
  getSystemPrompt: () => string | undefined;
}

export const useMessageHandler = ({
  messages,
  apiKey,
  addMessage,
  setLoadingState,
  handleError,
  getSystemPrompt
}: UseMessageHandlerProps) => {
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (!apiKey) {
      handleError('API key is not available. Please configure your Gemini API key.');
      return;
    }

    const userMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: Date.now()
    };

    addMessage(userMessage);
    setLoadingState(true);

    try {
      const systemPrompt = getSystemPrompt();
      const geminiMessages = convertToGeminiMessages(
        messages.concat(userMessage),
        systemPrompt
      );

      const responseText = await sendGeminiChatRequest(geminiMessages, apiKey);

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get a response. Please try again.';

      const errorMsg: AIMessage = {
        role: 'error',
        content: errorMessage,
        timestamp: Date.now()
      };

      addMessage(errorMsg);
      handleError(errorMessage);
    } finally {
      setLoadingState(false);
    }
  }, [messages, apiKey, addMessage, setLoadingState, handleError, getSystemPrompt]);

  return { sendMessage };
};
