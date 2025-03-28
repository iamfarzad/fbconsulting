import React from 'react';
import { X } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'file';
  file: File;
  preview?: string;
  name?: string;
}

interface MediaPreviewProps {
  mediaItems: MediaItem[];
  onRemove: (index: number) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaItems, onRemove }) => {
  if (mediaItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 border-t">
      {mediaItems.map((item, index) => (
        <div
          key={index}
          className="relative group rounded-lg overflow-hidden border border-border"
        >
          {item.type === 'image' && item.preview ? (
            <div className="w-16 h-16">
              <img
                src={item.preview}
                alt={item.file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-muted">
              <span className="text-xs text-muted-foreground truncate px-2">
                {item.name || item.file.name}
              </span>
            </div>
          )}
          <button
            onClick={() => onRemove(index)}
            aria-label={`Remove ${item.type === 'image' ? 'image' : 'file'}`}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 
                     opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
