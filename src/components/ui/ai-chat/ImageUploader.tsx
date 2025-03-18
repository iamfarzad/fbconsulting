
import React, { useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  images: { mimeType: string; data: string; preview: string }[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
  isUploading: boolean;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onUpload,
  onRemove,
  isUploading,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await onUpload(files[0]);
      // Reset the input so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.preview} 
                alt={`Uploaded ${index + 1}`}
                className="h-16 w-16 object-cover rounded-md border"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute -top-2 -right-2 bg-white/90 dark:bg-black/90 rounded-full p-0.5 
                         shadow hover:bg-white dark:hover:bg-black transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
          className={cn(
            "flex items-center gap-1.5 h-9 px-3",
            images.length > 0 ? "border-dashed" : ""
          )}
        >
          {isUploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              {images.length === 0 ? (
                <>
                  <ImageIcon size={14} />
                  <span>Add image</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Add another</span>
                </>
              )}
            </>
          )}
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};
