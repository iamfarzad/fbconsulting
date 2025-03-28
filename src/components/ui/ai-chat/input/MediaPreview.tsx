
import React from 'react';
import { X, FileText, Image } from 'lucide-react';

interface MediaPreviewProps {
  mediaItems: Array<{
    type: string;
    data: string;
    name?: string;
    mimeType?: string;
  }>;
  onRemove: (index: number) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaItems, onRemove }) => {
  if (mediaItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 my-2 px-3">
      {mediaItems.map((item, index) => (
        <div 
          key={index} 
          className="relative bg-muted rounded-md p-2 flex items-center gap-2 border border-border"
        >
          {item.type === 'image' ? (
            <>
              <div className="w-8 h-8 overflow-hidden rounded-sm">
                <img 
                  src={item.data} 
                  alt={item.name || "Image preview"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs max-w-36 truncate">{item.name || "Image"}</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs max-w-36 truncate">{item.name || "File"}</span>
            </>
          )}
          
          <button 
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-muted-foreground/90 hover:bg-foreground rounded-full p-0.5 text-background"
            aria-label="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
