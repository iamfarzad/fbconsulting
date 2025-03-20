
import React from 'react';
import { Mic, MicOff, Send, X, Paperclip, Image, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AnimatedBars } from '@/components/ui/AnimatedBars';

interface InputControlsProps {
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  onToggleMic?: () => void;
  isListening?: boolean;
  aiProcessing?: boolean;
  isVoiceSupported?: boolean;
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
  aiProcessing = false,
  isVoiceSupported = false,
  onToggleMedia,
  showMedia = false,
  onUploadImage,
  onUploadFile,
  onClearChat,
  className = '',
}) => {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleTriggerImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const handleTriggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Optional Actions */}
      {onClearChat && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearChat}
                className="h-8 w-8"
                disabled={isLoading || isListening}
              >
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Media Upload */}
      {onToggleMedia && (
        <Popover open={showMedia} onOpenChange={onToggleMedia}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isLoading || isListening}
            >
              <Paperclip size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2" align="end">
            <div className="flex flex-col gap-2">
              {onUploadImage && (
                <div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs"
                    size="sm"
                    onClick={handleTriggerImageUpload}
                  >
                    <Image size={14} className="mr-2" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onUploadImage}
                  />
                </div>
              )}
              
              {onUploadFile && (
                <div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs"
                    size="sm"
                    onClick={handleTriggerFileUpload}
                  >
                    <File size={14} className="mr-2" />
                    Upload File
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onUploadFile}
                  />
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {/* Voice Control */}
      {isVoiceSupported && onToggleMic && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? 'destructive' : 'ghost'}
                size="icon"
                onClick={onToggleMic}
                disabled={isLoading}
                className={cn('h-8 w-8 relative', isListening && 'bg-red-500')}
              >
                {isListening ? (
                  <>
                    <MicOff size={16} className="text-white" />
                    <span className="absolute -top-1 -right-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </span>
                  </>
                ) : (
                  <Mic size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop listening' : 'Start voice input'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Send Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSend}
              variant={hasContent ? 'default' : 'secondary'}
              size="icon"
              className={cn('h-8 w-8', !hasContent && 'opacity-50')}
              disabled={(!hasContent && !isListening) || isLoading}
            >
              {isLoading ? (
                <AnimatedBars isActive small />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
