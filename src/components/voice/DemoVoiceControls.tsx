import React from 'react';
import { AnimatedBars } from '../ui/AnimatedBars';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoVoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  aiProcessing?: boolean;
}

export const DemoVoiceControls: React.FC<DemoVoiceControlsProps> = ({
  isListening,
  toggleListening,
  disabled = false,
  aiProcessing = false,
}) => {
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled || aiProcessing}
        className={cn(
          "relative p-3 rounded-full transition-all duration-300 border",
          isListening 
            ? "bg-[#fe5a1d] text-white border-[#fe5a1d]/50" 
            : "text-black/80 hover:bg-black/5 border-black/20",
          disabled && "opacity-50 cursor-not-allowed",
          "dark:border-white/20 dark:text-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fe5a1d]/50"
        )}
        aria-label="Toggle voice input"
      >
        {isListening ? (
          <>
            <Mic className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1">
              <AnimatedBars isActive={true} small />
            </span>
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
        <span className="sr-only">Toggle voice input</span>
      </button>
    </div>
  );
};
