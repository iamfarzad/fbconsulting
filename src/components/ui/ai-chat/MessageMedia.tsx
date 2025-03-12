
import React from 'react';
import Image from 'next/image';
import { MediaContent } from '@/types/chatMedia';
import { cn } from '@/lib/utils';

interface MessageMediaProps {
  media: MediaContent;
  className?: string;
}

export const MessageMedia = ({ media, className }: MessageMediaProps) => {
  switch (media.type) {
    case 'image':
      return (
        <div className={cn("relative rounded-lg overflow-hidden my-2", className)}>
          <Image
            src={media.content}
            alt={media.metadata?.description || 'Chat image'}
            width={400}
            height={300}
            className="object-cover"
          />
          {media.metadata?.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {media.metadata.description}
            </p>
          )}
        </div>
      );
      
    case 'code':
      return (
        <pre className={cn("bg-muted p-4 rounded-lg my-2 overflow-x-auto", className)}>
          <code className={media.metadata?.language || ''}>
            {media.content}
          </code>
        </pre>
      );
      
    case 'link-preview':
      return (
        <div className={cn("border rounded-lg p-4 my-2", className)}>
          {media.metadata?.thumbnail && (
            <Image
              src={media.metadata.thumbnail}
              alt={media.metadata?.title || 'Link preview'}
              width={200}
              height={100}
              className="object-cover rounded-lg mb-2"
            />
          )}
          <h4 className="font-medium">{media.metadata?.title}</h4>
          <p className="text-sm text-muted-foreground">
            {media.metadata?.description}
          </p>
        </div>
      );
      
    // Add more media type handlers as needed
    
    default:
      return null;
  }
};
