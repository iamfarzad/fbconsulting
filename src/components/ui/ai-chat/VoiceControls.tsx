
import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatedBars } from '../AnimatedBars';

interface VoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled: boolean;
  aiProcessing: boolean;
}

export function VoiceControls({ 
  isListening, 
  toggleListening, 
  disabled, 
  aiProcessing
}: VoiceControlsProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled || aiProcessing}
            className={cn(
              "relative p-1.5 rounded-full transition-all duration-300 border",
              isListening 
                ? "bg-[#fe5a1d] text-white border-[#fe5a1d]/50" 
                : "text-black/80 hover:bg-black/5 border-black/20",
              disabled && "opacity-50 cursor-not-allowed",
              "dark:border-white/20 dark:text-white/80"
            )}
          >
            {isListening ? (
              <>
                <Mic className="w-4 h-4" />
                <span className="absolute -bottom-1 -right-1">
                  <AnimatedBars isActive={true} small />
                </span>
              </>
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span className="sr-only">Toggle voice input</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Stop listening" : "Start voice input"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
