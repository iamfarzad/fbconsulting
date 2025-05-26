
import { MediaContent, MediaType } from '@/types/chatMedia';

const MEDIA_MARKER_REGEX = /\[\[MEDIA:(\w+):([^:]+)(?::(\{.*?\}))?\]\]/g;

export const extractMediaContent = (content: string): { 
  textContent: string;
  media: MediaContent[];
} => {
  const media: MediaContent[] = [];
  let textContent = content;
  
  let mediaMatch;
  while ((mediaMatch = MEDIA_MARKER_REGEX.exec(content)) !== null) {
    const type = mediaMatch[1] as MediaType;
    const content = mediaMatch[2];
    const metadata = mediaMatch[3];
    
    const mediaContent: MediaContent = {
      type,
      content,
    };
    
    if (metadata) {
      try {
        mediaContent.metadata = JSON.parse(metadata);
      } catch (error) {
        console.error('Failed to parse media metadata:', error);
      }
    }
    
    media.push(mediaContent);
    textContent = textContent.replace(mediaMatch[0], '');
  }
  
  return {
    textContent: textContent.trim(),
    media
  };
};

export const buildMediaMarker = (
  type: MediaType,
  content: string,
  metadata?: Record<string, any>
): string => {
  if (metadata) {
    return `[[MEDIA:${type}:${content}:${JSON.stringify(metadata)}]]`;
  }
  return `[[MEDIA:${type}:${content}]]`;
};
