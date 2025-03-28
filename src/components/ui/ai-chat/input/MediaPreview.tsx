
import React from 'react';
import { X, Image, FileText } from 'lucide-react';

interface MediaItem {
  type: string;
  name: string;
  mimeType?: string;
  data: string;
}

interface MediaPreviewProps {
  mediaItems: MediaItem[];
  onRemove: (index: number) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaItems, onRemove }) => {
  if (!mediaItems || mediaItems.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-2 px-3">
      {mediaItems.map((file, index) => (
        <div 
          key={index}
          className="relative bg-muted p-2 rounded-md flex items-center gap-2"
        >
          {file.type.startsWith('image') ? (
            <Image className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="text-xs truncate max-w-[150px]">{file.name}</span>
          <button 
            type="button"
            onClick={() => onRemove(index)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreview;
