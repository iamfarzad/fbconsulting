
import React from 'react';
import { Mic, Image, Paperclip, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SendButton } from '../SendButton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputActionsProps {
  suggestedResponse: string | null;
  onSuggestionClick: () => void;
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  isListening: boolean;
  aiProcessing?: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  onClearChat: () => void;
  showMediaUpload: boolean;
  setShowMediaUpload: (show: boolean) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasMessages: boolean;
  className?: string;
}

export const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  suggestedResponse,
  onSuggestionClick,
  onSend,
  hasContent,
  isLoading,
  isListening,
  aiProcessing = false,
  toggleListening,
  isVoiceSupported,
  onClearChat,
  showMediaUpload,
  setShowMediaUpload,
  onImageUpload,
  onFileUpload,
  hasMessages,
  className
}) => {
  return (
    <div className={cn("flex items-center justify-between p-2", className)}>
      {/* Left side actions */}
      <div className="flex items-center gap-1">
        {suggestedResponse && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSuggestionClick}
            className="text-xs py-1 h-7 mr-1"
          >
            {suggestedResponse.length > 30
              ? `${suggestedResponse.substring(0, 30)}...`
              : suggestedResponse}
          </Button>
        )}
        
        {/* Voice button */}
        {isVoiceSupported && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8",
                    isListening && "text-destructive"
                  )}
                  onClick={toggleListening}
                  disabled={isLoading || aiProcessing}
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">
                    {isListening ? "Stop recording" : "Start recording"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isListening ? "Stop recording" : "Voice input"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Media upload toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                disabled={isLoading || isListening}
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach files</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach files</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Image upload input */}
        {showMediaUpload && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isLoading && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <Image className="h-4 w-4" />
                    <span className="sr-only">Upload image</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageUpload}
                      disabled={isLoading || isListening}
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent side="top">Upload image</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Document upload input */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label
                    htmlFor="file-upload"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isLoading && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Upload file</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={onFileUpload}
                      disabled={isLoading || isListening}
                    />
                  </label>
                </TooltipTrigger>
                <TooltipContent side="top">Upload file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        {/* Clear chat */}
        {hasMessages && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={onClearChat}
                  disabled={isLoading || isListening}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Clear chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Send button */}
      <SendButton
        hasContent={hasContent}
        isLoading={isLoading}
        aiProcessing={aiProcessing}
        disabled={isListening}
        onClick={onSend}
      />
    </div>
  );
};

export default ChatInputActions;
