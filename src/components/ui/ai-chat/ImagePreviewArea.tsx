
import React from "react";
import { X } from "lucide-react";

interface ImagePreviewAreaProps {
  images: { mimeType: string; data: string; preview: string }[];
  onRemoveImage: (index: number) => void;
}

export function ImagePreviewArea({ images, onRemoveImage }: ImagePreviewAreaProps) {
  return (
    <div className="px-4 pb-2 border-t border-black/10 pt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img 
              src={image.preview} 
              alt={`Uploaded ${index + 1}`}
              className="h-16 w-16 object-cover rounded-md border"
            />
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-white/90 dark:bg-black/90 rounded-full p-0.5 
                      shadow hover:bg-white dark:hover:bg-black transition-colors"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
