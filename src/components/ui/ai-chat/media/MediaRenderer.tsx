
import React from 'react';
import { MessageMedia } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';
import { ImageMedia } from './ImageMedia';
import { CodeMedia } from './CodeMedia';
import { LinkPreviewMedia } from './LinkPreviewMedia';

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
          alt={media.caption || 'Uploaded image'}
          description={media.caption}
          className={className}
        />
      );
      
    case 'code':
      return (
        <CodeMedia
          content={media.codeContent || ''}
          language={media.codeLanguage}
          className={className}
        />
      );
      
    case 'link':
      return (
        <LinkPreviewMedia
          title={media.linkTitle || media.name || 'Link'}
          description={media.linkDescription}
          thumbnail={media.linkImage}
          url={media.url || ''}
          className={className}
        />
      );
      
    case 'file':
      return (
        <div className={cn("flex items-center p-2 border rounded bg-muted/30", className)}>
          <div className="mr-2">📄</div>
          <div>
            <p className="text-sm font-medium">{media.fileName || media.name || 'File'}</p>
            {media.fileSize && <p className="text-xs text-muted-foreground">{formatFileSize(media.fileSize)}</p>}
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

// Utility function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}
