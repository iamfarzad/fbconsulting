
import React from 'react';
import { MediaContent } from '@/types/chatMedia';
import { cn } from '@/lib/utils';
import { ImageMedia } from './media/ImageMedia';
import { CodeMedia } from './media/CodeMedia';
import { LinkPreviewMedia } from './media/LinkPreviewMedia';

interface MessageMediaProps {
  media: MediaContent;
  className?: string;
}

export const MessageMedia = ({ media, className }: MessageMediaProps) => {
  switch (media.type) {
    case 'image':
      return (
        <ImageMedia
          src={media.content}
          alt={media.metadata?.description || 'Chat image'}
          description={media.metadata?.description}
          className={className}
        />
      );
      
    case 'code':
      return (
        <CodeMedia
          content={media.content}
          language={media.metadata?.language}
          className={className}
        />
      );
      
    case 'link-preview':
      return (
        <LinkPreviewMedia
          title={media.metadata?.title}
          description={media.metadata?.description}
          thumbnail={media.metadata?.thumbnail}
          className={className}
        />
      );
      
    default:
      return null;
  }
};
