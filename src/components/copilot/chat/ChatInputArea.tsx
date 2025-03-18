
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send, Image } from "lucide-react";
import { ImageUploader } from '@/components/ui/ai-chat/ImageUploader';

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  toggleListening: () => void;
  isLoading: boolean;
  isListening: boolean;
  isInitialized: boolean;
  isProviderLoading: boolean;
  isVoiceSupported: boolean;
  error: string | null;
  voiceError: string | null;
  // Add image-related props
  images?: { mimeType: string; data: string; preview: string }[];
  onUploadImage?: (file: File) => Promise<void>;
  onRemoveImage?: (index: number) => void;
  isUploading?: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  handleKeyDown,
  handleSendMessage,
  toggleListening,
  isLoading,
  isListening,
  isInitialized,
  isProviderLoading,
  isVoiceSupported,
  error,
  voiceError,
  // Image props with defaults
  images = [],
  onUploadImage,
  onRemoveImage,
  isUploading = false
}) => {
  const [showImageUploader, setShowImageUploader] = React.useState(false);
  
  return (
    <div className="border-t p-4">
      <div className="flex flex-col gap-2">
        {/* Image uploader (shown when toggled) */}
        {showImageUploader && onUploadImage && onRemoveImage && (
          <div className="mb-2">
            <ImageUploader
              images={images}
              onUpload={onUploadImage}
              onRemove={onRemoveImage}
              isUploading={isUploading}
            />
          </div>
        )}
        
        {/* Input area */}
        <div className="flex">
          <Textarea
            className="flex-1 min-h-[60px] max-h-[120px] resize-none border rounded-l-md p-3 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            disabled={isLoading || isListening || !isInitialized || isProviderLoading}
          />
          
          <div className="flex flex-col">
            {/* Image toggle button */}
            {onUploadImage && (
              <Button 
                variant="outline"
                size="icon"
                onClick={() => setShowImageUploader(!showImageUploader)}
                disabled={isLoading || !isInitialized || isProviderLoading}
                className={`rounded-none border-y border-r ${showImageUploader ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Image size={18} />
              </Button>
            )}
            
            {/* Voice input button */}
            {isVoiceSupported && (
              <Button 
                variant="outline"
                size="icon"
                onClick={toggleListening}
                disabled={isLoading || !isInitialized || isProviderLoading}
                className={`rounded-none border-y border-r h-1/2 ${isListening ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Mic size={18} />
              </Button>
            )}
            
            {/* Send button */}
            <Button 
              className="rounded-none rounded-tr-md border border-l-0 h-1/2" 
              onClick={handleSendMessage} 
              disabled={isLoading || (!inputValue.trim() && images.length === 0) || !isInitialized || isProviderLoading || isUploading}
            >
              {isLoading || isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Display voice error */}
      {voiceError && (
        <p className="mt-2 text-xs text-destructive">{voiceError}</p>
      )}
      
      {/* API error */}
      {error && !voiceError && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
