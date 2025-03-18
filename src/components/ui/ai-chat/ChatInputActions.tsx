
import React from "react";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface ChatInputActionsProps {
  hasMessages: boolean;
  onClear: () => void;
  images: { mimeType: string; data: string; preview: string }[];
  onUploadImage?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
  isLoading: boolean;
  isListening: boolean;
  isUploading?: boolean;
}

export function ChatInputActions({
  hasMessages,
  onClear,
  images,
  onUploadImage,
  onRemoveImage,
  isLoading,
  isListening,
  isUploading = false
}: ChatInputActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {hasMessages && (
        <button
          type="button"
          className="group p-2 hover:bg-black/10 rounded-lg transition-colors flex items-center gap-1"
          onClick={onClear}
          disabled={isLoading || isListening}
        >
          <Loader2 className="w-4 h-4 text-black" />
          <span className="text-xs text-black">
            Clear
          </span>
        </button>
      )}
      
      {images.length === 0 && onUploadImage && (
        <ImageUploader
          images={images}
          onUpload={onUploadImage}
          onRemove={onRemoveImage || (() => {})}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
