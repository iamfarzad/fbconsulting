
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
