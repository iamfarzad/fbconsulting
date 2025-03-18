
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled: boolean;
  aiProcessing: boolean;
  // New prop to indicate if using Gemini API for voice
  isUsingGeminiApi?: boolean;
}

export function VoiceControls({ 
  isListening, 
  toggleListening, 
  disabled, 
  aiProcessing, 
  isUsingGeminiApi = false 
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
              "p-1.5 rounded-md transition-all duration-300 border",
              isListening 
                ? "bg-[#fe5a1d] text-white border-[#fe5a1d]/50" 
                : "text-black/80 hover:bg-black/5 border-black/20",
              disabled && "opacity-50 cursor-not-allowed",
              "dark:border-white/20 dark:text-white/80",
              // Add a special indicator for Gemini API
              isUsingGeminiApi && !isListening && "border-[#fe5a1d]/30"
            )}
          >
            {isListening ? (
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
            <span className="sr-only">Toggle voice input</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isListening 
              ? "Stop listening" 
              : isUsingGeminiApi 
                ? "Start voice input (Gemini Charon)" 
                : "Start voice input"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
