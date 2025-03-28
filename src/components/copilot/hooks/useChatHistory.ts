
import { useState } from 'react';
import type { AIMessage as ChatMessage } from '@/features/gemini/types';

/**
 * Hook to manage chat history across different providers
 */
export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    gemini: [],
    openai: [],
    anthropic: [],
  });

  const addMessageToHistory = (provider: string, message: ChatMessage) => {
    setChatHistory(prev => {
      // Ensure we have an array for this provider
      const providerHistory = Array.isArray(prev[provider]) ? [...prev[provider]] : [];
      
      return {
        ...prev,
        [provider]: [...providerHistory, message],
      };
    });
  };

  const clearChatHistory = (provider: string) => {
    setChatHistory(prev => ({
      ...prev,
      [provider]: [],
    }));
  };

  return {
    chatHistory,
    addMessageToHistory,
    clearChatHistory
  };
}
