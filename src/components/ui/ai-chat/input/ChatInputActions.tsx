
import React, { useRef } from 'react';
import { Send, Mic, Image, X, MessageSquare, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputActionsProps {
  suggestedResponse: string | null;
  onSuggestionClick: () => void;
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isVoiceSupported: boolean;
  onClearChat: () => void;
  showMediaUpload: boolean;
  setShowMediaUpload: (show: boolean) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasMessages: boolean;
  aiProcessing?: boolean;
}

export const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  suggestedResponse,
  onSuggestionClick,
  onSend,
  hasContent,
  isLoading,
  isListening,
  toggleListening,
  isVoiceSupported,
  onClearChat,
  showMediaUpload,
  setShowMediaUpload,
  onImageUpload,
  onFileUpload,
  hasMessages,
  aiProcessing = false
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex items-center gap-1 p-2">
      {/* Suggested Response */}
      {suggestedResponse && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onSuggestionClick}
          className="mr-auto text-xs flex items-center gap-1 bg-muted/50"
        >
          <MessageSquare className="h-3 w-3" />
          <span className="truncate max-w-[120px]">{suggestedResponse}</span>
        </Button>
      )}
      
      <div className="ml-auto flex items-center gap-1">
        {/* Media Upload */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                className="h-8 w-8"
                disabled={isLoading || isListening}
              >
                {showMediaUpload ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Image className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {showMediaUpload ? 'Cancel' : 'Add media'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {showMediaUpload && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleImageClick}
                    className="h-8 w-8"
                    disabled={isLoading || isListening}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Upload image
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleFileClick}
                    className="h-8 w-8"
                    disabled={isLoading || isListening}
                  >
                    <File className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Upload document
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onFileUpload}
              className="hidden"
            />
          </>
        )}
        
        {/* Voice Button */}
        {isVoiceSupported && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={toggleListening}
                  disabled={isLoading || aiProcessing}
                  className={cn(
                    "h-8 w-8",
                    isListening && "text-red-500"
                  )}
                >
                  <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isListening ? 'Stop listening' : 'Voice input'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Send Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onSend}
                disabled={isLoading || !hasContent}
                className="h-8 w-8 text-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Send message
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatInputActions;
