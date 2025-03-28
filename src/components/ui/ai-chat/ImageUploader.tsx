
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Image, Loader2 } from 'lucide-react';

interface ImagePreview {
  mimeType: string;
  data: string;
  preview: string;
}

interface ImageUploaderProps {
  images: ImagePreview[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
  isUploading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onUpload, 
  onRemove,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onUpload(e.target.files[0]);
      e.target.value = ''; // Reset the input
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative border rounded-md overflow-hidden h-16 w-16 group"
          >
            <img 
              src={image.preview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full opacity-70 hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {isUploading && (
          <div className="flex items-center justify-center border rounded-md h-16 w-16 bg-background/30">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center justify-center border rounded-md h-16 w-16 hover:bg-muted/50 transition-colors"
        >
          <Image className="h-6 w-6 text-muted-foreground" />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
