
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatedBars } from '@/components/ui/AnimatedBars';

interface VoiceButtonProps {
  isListening: boolean;
  onToggleMic: () => void;
  isLoading: boolean;
  aiProcessing: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggleMic,
  isLoading,
  aiProcessing,
}) => {
  return (
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
  );
};
