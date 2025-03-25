export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string | number;
}

export interface CopilotProvider {
  initialize: () => void;
  handleEvent: (event: string, data: any) => void;
}

// Helper function to get message text content
export function getMessageText(message: ChatMessage): string {
  return message.content;
}
