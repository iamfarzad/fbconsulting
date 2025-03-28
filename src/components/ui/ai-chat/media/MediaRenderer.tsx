
import React from 'react';
import { MessageMedia } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';
import { ImageMedia } from './ImageMedia';
import { CodeMedia } from './CodeMedia';
import { LinkPreviewMedia } from './LinkPreviewMedia';
import { FileText } from 'lucide-react';

interface MediaRendererProps {
  media: MessageMedia;
  className?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ media, className }) => {
  // Check media type and render appropriate component
  switch (media.type) {
    case 'image':
      return (
        <ImageMedia
          src={media.url || media.data || ''}
          alt={media.caption || 'Image'}
          className={className}
        />
      );
    case 'code':
      return (
        <CodeMedia
          code={media.data || ''}
          language={media.mimeType?.split('/')[1] || 'text'}
          className={className}
        />
      );
    case 'link':
      return (
        <LinkPreviewMedia
          url={media.url || ''}
          title={media.caption}
          className={className}
        />
      );
    case 'document':
      return (
        <a 
          href={media.url || media.data || '#'} 
          download={media.fileName}
          className={cn(
            "flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
            className
          )}
        >
          <FileText className="h-5 w-5 text-blue-500" />
          <span>{media.fileName || media.caption || 'Document'}</span>
        </a>
      );
    default:
      return null;
  }
}

export default MediaRenderer;
