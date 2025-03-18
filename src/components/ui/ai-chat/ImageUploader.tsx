
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: { mimeType: string; data: string; preview: string }[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onUpload,
  onRemove,
  isUploading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onUpload(e.target.files[0]);
      e.target.value = ""; // Reset the input
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-xl"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          {images.length > 0 ? `${images.length} image${images.length > 1 ? "s" : ""} attached` : "No images attached"}
        </p>
      </div>
      
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview}
                alt={`Uploaded ${index + 1}`}
                className="h-16 w-16 object-cover rounded-xl border"
              />
              <button
                className="absolute top-0 right-0 bg-black/70 hover:bg-black text-white p-0.5 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-70 hover:opacity-100"
                onClick={() => onRemove(index)}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
