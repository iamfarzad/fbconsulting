
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UploadedFile {
  name: string;
  data: string;
  mimeType: string;
  type: string; // 'image' or 'document'
  size?: number;
  preview?: string;
}

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      
      const isImage = file.type.startsWith('image/');
      const maxSizeMB = isImage ? 5 : 10; // 5MB for images, 10MB for documents
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${maxSizeMB}MB.`,
          variant: "destructive",
        });
        return;
      }
      
      // Read file as data URL
      const reader = new FileReader();
      
      const fileData: UploadedFile = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          if (!e.target?.result) {
            reject(new Error("Failed to read file"));
            return;
          }
          
          const data = e.target.result as string;
          
          resolve({
            name: file.name,
            data: data.split(',')[1], // Remove the data:image/jpeg;base64, part
            mimeType: file.type,
            type: isImage ? 'image' : 'document',
            size: file.size,
            preview: isImage ? data : undefined
          });
        };
        
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        
        reader.readAsDataURL(file);
      });
      
      setFiles(prev => [...prev, fileData]);
      
      toast({
        title: "File uploaded",
        description: `${file.name} added successfully.`,
      });
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    isUploading,
    uploadFile,
    removeFile,
    clearFiles
  };
}
