
import React from 'react';
import { MessageMedia as MessageMediaType } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';
import { MediaRenderer } from './media/MediaRenderer';

interface MessageMediaProps {
  media: MessageMediaType[];
  className?: string;
}

export const MessageMedia: React.FC<MessageMediaProps> = ({ media, className }) => {
  if (!media || media.length === 0) return null;
  
  return (
    <div className={cn("space-y-2", className)}>
      {media.map((item, index) => (
        <MediaRenderer 
          key={`media-${index}`} 
          media={item} 
          className="mb-2"
        />
      ))}
    </div>
  );
};
