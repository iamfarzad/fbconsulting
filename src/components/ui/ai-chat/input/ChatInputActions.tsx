
import React from 'react';
import { SendButton } from '@/components/ui/ai-chat/SendButton';
import { PaperclipIcon, Trash2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  return (
    <div className="flex items-center justify-between w-full px-3 py-1.5 border-t border-border">
      {/* Left side buttons */}
      <div className="flex items-center space-x-1">
        {/* Media upload button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                disabled={isLoading || isListening}
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Add attachment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Voice input button */}
        {isVoiceSupported && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${isListening ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={toggleListening}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isListening ? 'Stop voice input' : 'Start voice input'}</p>
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
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onClearChat}
                  disabled={isLoading || isListening}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Clear chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Right side send button */}
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
