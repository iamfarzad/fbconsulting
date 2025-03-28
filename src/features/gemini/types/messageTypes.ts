
export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  id?: string;
}

export interface AudioMessage {
  format: string;
  data: ArrayBuffer;
  size: number;
}

export interface MessageHistoryItem {
  role: 'user' | 'assistant' | 'system';
  parts: { text: string }[];
}

export interface FileAttachment {
  type: string;
  mimeType: string;
  data: string;
  name: string;
}
