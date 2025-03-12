
import { useState, useEffect, useCallback } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import {
  saveConversationHistory,
  loadConversationHistory
} from '@/services/storage/localStorageManager';

/**
 * Hook for managing message storage and persistence
 */
export const useMessageStorage = (initialMessages?: AIMessage[]) => {
  // Initialize state with provided messages or load from storage
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    return initialMessages || loadConversationHistory();
  });
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory(messages);
    }
  }, [messages]);
  
  // Function to explicitly persist messages
  const persistMessages = useCallback((msgs: AIMessage[]) => {
    saveConversationHistory(msgs);
  }, []);
  
  return { messages, setMessages, persistMessages };
};
