export type MediaType = 'image' | 'code' | 'link-preview' | 'poll' | 'audio' | 'video';

export interface MediaContent {
  type: MediaType;
  content: string;
  metadata?: {
    title?: string;
    description?: string;
    thumbnail?: string;
    language?: string; // For code blocks
    duration?: number; // For audio/video
    options?: string[]; // For polls
  };
}

export interface ChatMessageMedia {
  media?: MediaContent[];
}

// New MessageMedia type for multimodal support
export interface MessageMedia {
  type: 'image' | 'code' | 'link' | 'document';
  url?: string;
  data?: string;
  caption?: string;
  fileName?: string;
  mimeType?: string;
}

// Update AIMessage to support media attachments
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: number;
  media?: MessageMedia[];
  isLoading?: boolean;
  error?: string;
}

// Multimodal Message format for WebSocket communication
export interface MultiModalMessage {
  type: 'multimodal_message';
  text?: string;
  files: {
    mime_type: string;
    data: string;
    filename?: string;
  }[];
  role: 'user' | 'assistant' | 'system';
  enableTTS: boolean;
}

// Text-only Message format for WebSocket communication
export interface TextMessage {
  type: 'text_message';
  text: string;
  role: 'user' | 'assistant' | 'system';
  enableTTS: boolean;
}
