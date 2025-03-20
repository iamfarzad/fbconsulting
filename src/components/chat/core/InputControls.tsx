
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Send, Image, Paperclip, Loader2, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatedBars } from '@/components/ui/AnimatedBars';

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleMedia}
                className={cn(
                  'rounded-full w-8 h-8',
                  showMedia && 'bg-primary/10 text-primary'
                )}
                disabled={isLoading || isListening}
              >
                {showMedia ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showMedia ? 'Hide media options' : 'Add files'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Media upload buttons */}
      {showMedia && onUploadImage && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleImageButtonClick}
                className="rounded-full w-8 h-8"
                disabled={isLoading || isListening}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Clear chat button */}
      {onClearChat && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearChat}
                className="text-xs h-8 px-2 rounded-full"
                disabled={isLoading || isListening}
              >
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear chat history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Voice input controls */}
      {isVoiceSupported && onToggleMic && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isListening ? "default" : "ghost"}
                size="icon"
                onClick={onToggleMic}
                className={cn(
                  'rounded-full w-8 h-8',
                  isListening && 'bg-primary text-primary-foreground'
                )}
                disabled={isLoading || aiProcessing}
              >
                {isListening ? (
                  <div className="flex items-center justify-center">
                    <AnimatedBars className="h-3 w-3" isActive={true} />
                  </div>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop listening' : 'Use voice input'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Send button */}
      <Button
        type="submit"
        size="icon"
        variant={hasContent ? "default" : "ghost"}
        onClick={onSend}
        className={cn(
          'rounded-full w-8 h-8',
          !hasContent && 'text-muted-foreground'
        )}
        disabled={(!hasContent && !isListening) || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
