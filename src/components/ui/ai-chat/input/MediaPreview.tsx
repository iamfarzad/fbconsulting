
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  mediaItems: Array<{
    type: string;
    data: string;
    name?: string;
    mimeType?: string;
  }>;
  onRemove: (index: number) => void;
  className?: string;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaItems,
  onRemove,
  className
}) => {
  if (!mediaItems || mediaItems.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2 p-2", className)}>
      {mediaItems.map((item, index) => (
        <div key={index} className="relative group">
          {item.type === 'image' ? (
            <div className="w-16 h-16 rounded-md overflow-hidden border">
              <img
                src={item.data}
                alt={item.name || 'Uploaded image'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md overflow-hidden border flex items-center justify-center bg-muted">
              <span className="text-xs text-center p-1 truncate">
                {item.name || 'File'}
              </span>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
