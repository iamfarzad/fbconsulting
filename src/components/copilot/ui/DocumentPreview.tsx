import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadedDocument } from '@/hooks/gemini/useDocumentUpload';
import { X, FileText, File } from 'lucide-react';

interface DocumentPreviewProps {
  documents: UploadedDocument[];
  onRemove: (index: number) => void;
  isUploading: boolean;
}

const DocumentIcon = ({ mimeType }: { mimeType: string }) => {
  switch (mimeType) {
    case 'application/pdf':
      return <File className="w-6 h-6 text-red-500" />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileText className="w-6 h-6 text-blue-500" />;
    default:
      return <FileText className="w-6 h-6 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documents,
  onRemove,
  isUploading
}) => {
  if (documents.length === 0 && !isUploading) {
    return null;
  }

  return (
    <div className="p-4 space-y-2 border rounded-lg bg-background">
      {isUploading && (
        <div className="mb-4">
          <Progress value={30} className="w-full" />
          <p className="mt-2 text-sm text-muted-foreground">Uploading documents...</p>
        </div>
      )}

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
          >
            <div className="flex items-center space-x-3">
              <DocumentIcon mimeType={doc.mimeType} />
              <div className="space-y-1">
                <p className="text-sm font-medium">{doc.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(doc.size)}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
