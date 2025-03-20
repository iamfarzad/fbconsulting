
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  isLoading: boolean;
  isVoiceSupported?: boolean;
  tooltipText?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggle,
  isLoading,
  isVoiceSupported = true,
  tooltipText = isListening ? 'Stop listening' : 'Start voice input',
}) => {
  // Don't render the button if voice isn't supported
  if (!isVoiceSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? "outline" : "ghost"}
            size="icon"
            onClick={onToggle}
            className={`rounded-full w-8 h-8 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
