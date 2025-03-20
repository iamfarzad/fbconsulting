
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClearChatButtonProps {
  onClearChat: () => void;
  isLoading: boolean;
  isListening: boolean;
}

export const ClearChatButton: React.FC<ClearChatButtonProps> = ({
  onClearChat,
  isLoading,
  isListening,
}) => {
  return (
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
  );
};
