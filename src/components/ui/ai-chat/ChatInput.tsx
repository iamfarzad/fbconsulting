
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadedFile } from '@/hooks/useFileUpload';

interface ChatInputProps {
  value: string;
  setValue: (value: string) => void;
  onSend: (files?: any[]) => void;
  onClear?: () => void;
  isLoading?: boolean;
  showMessages?: boolean;
  hasMessages?: boolean;
  suggestedResponse?: string | null;
  placeholder?: string;
  files?: UploadedFile[];
  onUploadFile?: (file: File) => Promise<void>;
  onRemoveFile?: (index: number) => void;
  isUploading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  setValue,
  onSend,
  onClear,
  isLoading = false,
  showMessages = true,
  hasMessages = false,
  suggestedResponse = null,
  placeholder = "Type your message...",
  files = [],
  onUploadFile,
  onRemoveFile,
  isUploading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSend = () => {
    if (value.trim() || (files && files.length > 0)) {
      onSend();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  
  return (
    <div className="relative">
      {/* File preview area */}
      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="relative bg-muted p-2 rounded-md flex items-center gap-2"
            >
              {file.type.startsWith('image/') ? (
                <Image className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span className="text-xs truncate max-w-[150px]">{file.name}</span>
              <button 
                type="button"
                onClick={() => onRemoveFile && onRemoveFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2 border rounded-lg focus-within:ring-1 focus-within:ring-primary bg-background">
        {/* Textarea input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] max-h-[200px]"
          disabled={isLoading}
          rows={1}
        />
        
        <div className="flex items-center p-2 gap-1">
          {/* File upload button */}
          {onUploadFile && (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={triggerFileUpload}
                disabled={isLoading || isUploading}
                className="h-8 w-8"
              >
                <Image className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0] && onUploadFile) {
                    onUploadFile(e.target.files[0]);
                    e.target.value = ''; // Reset the input
                  }
                }}
                className="hidden"
              />
            </>
          )}
          
          {/* Voice input button (placeholder) */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            disabled={true} // Disabled as voice input isn't implemented yet
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          {/* Send button */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleSend}
            disabled={isLoading || (!value.trim() && (!files || files.length === 0))}
            className="h-8 w-8 text-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
