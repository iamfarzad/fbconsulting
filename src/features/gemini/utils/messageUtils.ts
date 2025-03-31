import { Message } from '@/types/message';

export const processMessage = (message: Message) => {
  return {
    role: message.role,
    content: message.content,
    timestamp: message.timestamp || Date.now()
  };
};

export const extractMessageContent = (text: string) => {
  return text.trim();
};
