
// Types for AI message history
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
