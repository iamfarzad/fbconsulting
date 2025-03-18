
import React, { useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { Loader2 } from "lucide-react";
import { UploadedFile } from "@/hooks/useFileUpload";

interface FileUploaderProps {
  files: UploadedFile[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1 text-xs px-1.5 py-1 border border-black/20 rounded-md hover:bg-black/5 transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3 w-3" />
              <span>Upload File</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-muted-foreground">
          {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "No files attached"}
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type === 'image' ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-14 w-14 object-cover rounded-lg border"
                />
              ) : (
                <div className="h-14 w-14 flex flex-col items-center justify-center border rounded-lg bg-gray-50">
                  <File size={18} className="text-gray-500" />
                  <span className="text-[10px] text-gray-500 mt-1 px-1 truncate w-full text-center">
                    {file.name.split('.').pop()}
                  </span>
                </div>
              )}
              <div className="absolute -top-1 -right-1">
                <button
                  className="bg-black/70 hover:bg-black text-white p-0.5 rounded-full opacity-70 hover:opacity-100"
                  onClick={() => onRemove(index)}
                >
                  <X size={10} />
                </button>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 flex justify-center">
                <span className="text-[8px] bg-black/70 text-white px-1 rounded-sm">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};
