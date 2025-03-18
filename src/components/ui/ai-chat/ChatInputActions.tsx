
import React from "react";
import { Loader2 } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { UploadedFile } from "@/hooks/useFileUpload";

interface ChatInputActionsProps {
  hasMessages: boolean;
  onClear: () => void;
  files: UploadedFile[];
  onUploadFile?: (file: File) => Promise<void>;
  onRemoveFile?: (index: number) => void;
  isLoading: boolean;
  isListening: boolean;
  isUploading?: boolean;
}

export function ChatInputActions({
  hasMessages,
  onClear,
  files,
  onUploadFile,
  onRemoveFile,
  isLoading,
  isListening,
  isUploading = false
}: ChatInputActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {hasMessages && (
        <button
          type="button"
          className="group p-1.5 hover:bg-black/10 rounded-lg transition-colors flex items-center gap-1"
          onClick={onClear}
          disabled={isLoading || isListening}
        >
          <Loader2 className="w-3.5 h-3.5 text-black" />
          <span className="text-xs text-black">
            Clear
          </span>
        </button>
      )}
      
      {files.length === 0 && onUploadFile && (
        <FileUploader
          files={files}
          onUpload={onUploadFile}
          onRemove={onRemoveFile || (() => {})}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
