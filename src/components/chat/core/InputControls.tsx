
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { MediaUploadButton } from './controls/MediaUploadButton';
import { ImageUploadButton } from './controls/ImageUploadButton';
import { ClearChatButton } from './controls/ClearChatButton';
import { VoiceButton } from './controls/VoiceButton';
import { SendMessageButton } from './controls/SendMessageButton';

interface InputControlsProps {
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  onToggleMic?: () => void;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  aiProcessing?: boolean;
  onToggleMedia?: () => void;
  showMedia?: boolean;
  onUploadImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearChat?: () => void;
  className?: string;
}

export const InputControls: React.FC<InputControlsProps> = ({
  onSend,
  hasContent,
  isLoading,
  onToggleMic,
  isListening = false,
  isVoiceSupported = false,
  aiProcessing = false,
  onToggleMedia,
  showMedia = false,
  onUploadImage,
  onUploadFile,
  onClearChat,
  className = '',
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Hidden inputs for file uploads */}
      {onUploadImage && (
        <input 
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={onUploadImage}
          className="sr-only"
        />
      )}
      
      {onUploadFile && (
        <input 
          ref={fileInputRef}
          type="file"
          onChange={onUploadFile}
          className="sr-only"
        />
      )}
      
      {/* Media upload controls */}
      {onToggleMedia && (
        <MediaUploadButton 
          showMedia={showMedia}
          onToggleMedia={onToggleMedia}
          isLoading={isLoading}
          isListening={isListening}
        />
      )}
      
      {/* Media upload buttons */}
      {showMedia && onUploadImage && (
        <ImageUploadButton
          onImageUpload={handleImageButtonClick}
          isLoading={isLoading}
          isListening={isListening}
        />
      )}
      
      {/* Clear chat button */}
      {onClearChat && (
        <ClearChatButton
          onClearChat={onClearChat}
          isLoading={isLoading}
          isListening={isListening}
        />
      )}
      
      {/* Voice input controls */}
      {isVoiceSupported && onToggleMic && (
        <VoiceButton
          isListening={isListening}
          onToggleMic={onToggleMic}
          isLoading={isLoading}
          aiProcessing={aiProcessing}
        />
      )}
      
      {/* Send button */}
      <SendMessageButton
        hasContent={hasContent}
        isLoading={isLoading}
        onClick={onSend}
        disabled={!isListening}
      />
    </div>
  );
};
