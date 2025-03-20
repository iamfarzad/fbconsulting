
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVoiceService } from '@/hooks/useVoiceService';

interface VoiceButtonProps {
  onToggle?: () => void;
  isLoading?: boolean;
  tooltipText?: string;
  onVoiceCommand?: (command: string) => void;
  isListening?: boolean;
  isVoiceSupported?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onToggle,
  isLoading = false,
  tooltipText,
  onVoiceCommand,
  isListening = false,
  isVoiceSupported = true
}) => {
  const {
    toggleListening,
    recognitionSupported
  } = useVoiceService({
    onTranscriptComplete: (text) => {
      if (onVoiceCommand && text.trim()) {
        onVoiceCommand(text);
      }
    }
  });

  const handleToggle = () => {
    toggleListening();
    if (onToggle) {
      onToggle();
    }
  };

  // Don't render the button if voice isn't supported
  if (!recognitionSupported || !isVoiceSupported) {
    return null;
  }

  const defaultTooltip = isListening ? 'Stop listening' : 'Start voice input';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? "outline" : "ghost"}
            size="icon"
            onClick={handleToggle}
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
          <p>{tooltipText || defaultTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
