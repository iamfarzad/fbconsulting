import React from 'react';
import { cn } from '@/lib/utils';
import { Send, Mic, MicOff, Image, Paperclip, X, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputActionsProps {
  suggestedResponse?: string | null;
  onSuggestionClick?: () => void;
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
  // Hide file inputs visually but keep them accessible
  const fileInputClasses = "sr-only";
  
  return (
    <div className="flex items-center px-3 pb-3">
      {/* Suggested response if available */}
      {suggestedResponse && onSuggestionClick && (
        <div className="mr-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onSuggestionClick}
            className="text-xs"
          >
            {suggestedResponse.length > 30
              ? `${suggestedResponse.substring(0, 30)}...`
              : suggestedResponse}
          </Button>
        </div>
      )}
      
      <div className="ml-auto flex items-center gap-2">
        {/* Media upload buttons */}
        {showMediaUpload ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    onClick={() => setShowMediaUpload(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close media options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Image className="h-5 w-5" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={onImageUpload}
                      className={fileInputClasses}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Paperclip className="h-5 w-5" />
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={onFileUpload}
                      className={fileInputClasses}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  type="button"
                  onClick={() => setShowMediaUpload(true)}
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add file or image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Voice input button */}
        {isVoiceSupported && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isListening ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-8 w-8", 
                    isListening && "animate-pulse bg-primary text-primary-foreground"
                  )}
                  onClick={toggleListening}
                  disabled={isLoading || aiProcessing}
                  type="button"
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isListening ? "Stop listening" : "Voice input"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Clear chat button */}
        {hasMessages && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onClearChat}
                  disabled={isLoading || isListening}
                  type="button"
                >
                  <RefreshCcw className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Send button */}
        <Button
          type="button"
          size="sm"
          className={cn(
            "rounded-full px-4 h-8",
            hasContent ? "bg-primary hover:bg-primary/90" : "bg-muted text-muted-foreground"
          )}
          disabled={!hasContent || isLoading || isListening}
          onClick={onSend}
          variant="default"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInputActions;
