
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { InputControls } from '../../chat/core/InputControls';
import { ImagePreviewArea } from './ImagePreviewArea';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';

interface UploadedImage {
  mimeType: string;
  data: string;
  preview: string;
  type: string;
  name: string;
}

interface EnhancedChatInputProps {
  onSendMessage: (message: string, images?: UploadedImage[]) => void;
  onClearChat?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  isVoiceSupported?: boolean;
  onToggleVoice?: () => void;
  isListening?: boolean;
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSendMessage,
  onClearChat,
  placeholder = 'Type your message...',
  isLoading = false,
  className,
  isVoiceSupported = false,
  onToggleVoice,
  isListening = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showMedia, setShowMedia] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 40,
    maxHeight: 200
  });

  const handleSend = () => {
    if ((!inputValue.trim() && images.length === 0) || isLoading) return;
    
    onSendMessage(inputValue, images.length > 0 ? images : undefined);
    setInputValue('');
    setImages([]);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const newImage = {
            mimeType: file.type,
            data: event.target.result,
            preview: URL.createObjectURL(file),
            type: 'image',
            name: file.name
          };
          
          setImages(prev => [...prev, newImage]);
          setIsUploading(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="rounded-lg border bg-background p-2">
        <Textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholder}
          className="min-h-10 resize-none border-0 p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading || isListening}
        />
        
        {images.length > 0 && (
          <ImagePreviewArea 
            images={images} 
            onRemoveImage={handleRemoveImage} 
          />
        )}
        
        <div className="flex items-center justify-between pt-2">
          <InputControls
            onSend={handleSend}
            hasContent={!!inputValue.trim() || images.length > 0}
            isLoading={isLoading || isUploading}
            onToggleMic={isVoiceSupported ? onToggleVoice : undefined}
            isListening={isListening}
            isVoiceSupported={isVoiceSupported}
            onToggleMedia={() => setShowMedia(!showMedia)}
            showMedia={showMedia}
            onUploadImage={handleUploadImage}
            onClearChat={onClearChat}
          />
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
        className="hidden"
      />
    </div>
  );
};
