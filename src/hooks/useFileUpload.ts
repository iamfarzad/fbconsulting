
import { useState } from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
  mimeType: string;
  data: string;
  preview: string;
  name: string;
  type: 'image' | 'document';
  size: number;
}

interface UseFileUploadReturn {
  files: UploadedFile[];
  uploadFile: (file: File) => Promise<void>;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  isUploading: boolean;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Extract just the base64 data without the prefix
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const getFileType = (mimeType: string): 'image' | 'document' => {
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    return 'document';
  };

  const getPreviewUrl = (file: File): string => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    
    // For documents, return an icon based on file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // We could add more icons for different file types in the future
    switch (fileExtension) {
      case 'pdf':
        return '/document-icons/pdf.svg';
      case 'doc':
      case 'docx':
        return '/document-icons/doc.svg';
      case 'xls':
      case 'xlsx':
        return '/document-icons/xls.svg';
      case 'ppt':
      case 'pptx':
        return '/document-icons/ppt.svg';
      case 'txt':
        return '/document-icons/txt.svg';
      default:
        return '/document-icons/generic.svg';
    }
  };

  const uploadFile = async (file: File): Promise<void> => {
    try {
      setIsUploading(true);
      
      // Validate file type
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const supportedDocumentTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!supportedImageTypes.includes(file.type) && !supportedDocumentTypes.includes(file.type)) {
        toast.error('Unsupported file type', {
          description: 'Please upload an image or document file (jpg, png, pdf, txt, doc, docx)'
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'File must be less than 10MB'
        });
        return;
      }
      
      // Convert to base64
      const base64Data = await fileToBase64(file);
      
      // Create a preview URL for UI display
      const previewUrl = getPreviewUrl(file);
      
      // Add the file to state
      setFiles(prev => [...prev, {
        mimeType: file.type,
        data: base64Data,
        preview: previewUrl,
        name: file.name,
        type: getFileType(file.type),
        size: file.size
      }]);
      
      toast.success('File uploaded', {
        description: `${file.name} has been attached to your message`
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file', {
        description: 'Please try again with another file'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number): void => {
    setFiles(prev => {
      const newFiles = [...prev];
      
      // Revoke the object URL to avoid memory leaks if it's an image
      if (newFiles[index].type === 'image') {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      
      // Remove the file from the array
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearFiles = (): void => {
    // Revoke all object URLs for images
    files.forEach(file => {
      if (file.type === 'image') {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  };

  return {
    files,
    uploadFile,
    removeFile,
    clearFiles,
    isUploading
  };
};
