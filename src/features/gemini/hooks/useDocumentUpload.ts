import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UploadedDocument {
  filename: string;
  mimeType: string;
  text: string;
  size: number;
}

export interface UseDocumentUploadResult {
  documents: UploadedDocument[];
  uploadDocuments: (files: FileList | null) => Promise<void>;
  removeDocument: (index: number) => void;
  clearDocuments: () => void;
  isUploading: boolean;
}

const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function useDocumentUpload(): UseDocumentUploadResult {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported File Type",
        description: "Please upload PDF, DOCX, or TXT files only",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadDocuments = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      let hasValidFiles = false;

      // Validate and append files
      for (let i = 0; i < files.length; i++) {
        if (validateFile(files[i])) {
          formData.append('files', files[i]);
          hasValidFiles = true;
        }
      }

      if (!hasValidFiles) {
        setIsUploading(false);
        return;
      }

      const response = await fetch('/api/gemini_document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload documents');
      }

      const data = await response.json();

      if (!data.success || !data.documents) {
        throw new Error('Invalid document upload response');
      }

      // Add the new documents to the list
      setDocuments(prev => [...prev, ...data.documents]);

      toast({
        title: "Success",
        description: `${data.documents.length} document(s) uploaded successfully`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload documents",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const clearDocuments = () => {
    setDocuments([]);
  };

  return {
    documents,
    uploadDocuments,
    removeDocument,
    clearDocuments,
    isUploading,
  };
}

export default useDocumentUpload;
