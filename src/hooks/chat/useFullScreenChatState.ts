
import { useEffect, useState } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';

export function useFullScreenChatState(initialMessages: AIMessage[]) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);

  // Update messages when props change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return { messages };
}
