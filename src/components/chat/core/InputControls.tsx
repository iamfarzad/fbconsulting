
import React from 'react';
import { SendMessageButton } from './controls/SendMessageButton';
import { VoiceButton } from './controls/VoiceButton';
import { ClearChatButton } from './controls/ClearChatButton';
import { ImageUploadButton } from './controls/ImageUploadButton';
import { useRef } from 'react';

interface InputControlsProps {
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  onToggleMic?: () => void;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  onClearChat?: () => void;
  onToggleMedia?: () => void;
  showMedia?: boolean;
  onUploadImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  aiProcessing?: boolean;
}

export const InputControls: React.FC<InputControlsProps> = ({
  onSend,
  hasContent,
  isLoading,
  onToggleMic,
  isListening = false,
  isVoiceSupported = false,
  onClearChat,
  onToggleMedia,
  showMedia = false,
  onUploadImage,
  onUploadFile,
  aiProcessing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleDocumentClick = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-1">
        {/* Only show image upload if handler is provided */}
        {onUploadImage && (
          <>
            <ImageUploadButton 
              onImageUpload={handleUploadClick} 
              isLoading={isLoading} 
              isListening={isListening || false} 
            />
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              className="hidden"
            />
          </>
        )}
        
        {/* File upload input if provided */}
        {onUploadFile && (
          <>
            <input 
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onUploadFile}
              className="hidden"
            />
          </>
        )}
      
        {/* Voice button */}
        {onToggleMic && isVoiceSupported && (
          <VoiceButton 
            isListening={isListening} 
            onToggle={onToggleMic} 
            isLoading={isLoading || aiProcessing}
            isVoiceSupported={isVoiceSupported}
          />
        )}
        
        {/* Clear chat button */}
        {onClearChat && (
          <ClearChatButton 
            onClearChat={onClearChat} 
            isLoading={isLoading} 
            isListening={isListening || false} 
          />
        )}
      </div>
      
      {/* Send button */}
      <SendMessageButton 
        onClick={onSend} 
        hasContent={hasContent} 
        isLoading={isLoading} 
        disabled={isListening || false}
        aiProcessing={aiProcessing} 
      />
    </div>
  );
};
