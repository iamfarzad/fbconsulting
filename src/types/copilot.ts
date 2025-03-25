export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string | number;
}

// Helper function to get message text content
export function getMessageText(message: ChatMessage): string {
  return message.content;
}
