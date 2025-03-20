
import React from 'react';
import { X } from 'lucide-react';

interface MediaItem {
  type: string;
  data: string;
  name?: string;
  mimeType?: string;
}

interface MediaPreviewProps {
  mediaItems: MediaItem[];
  onRemove: (index: number) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaItems,
  onRemove
}) => {
  if (mediaItems.length === 0) return null;
  
  return (
    <div className="px-4 pb-2 flex flex-wrap gap-2">
      {mediaItems.map((item, index) => (
        <div 
          key={index} 
          className="relative group h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center"
        >
          {item.type === 'image' ? (
            <img 
              src={item.data} 
              alt={item.name || 'Uploaded image'} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-xs p-1">
              <span className="truncate w-full text-center">
                {item.name || 'File'}
              </span>
            </div>
          )}
          <button
            onClick={() => onRemove(index)}
            className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
};
