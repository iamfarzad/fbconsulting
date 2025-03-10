
import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled: boolean;
  aiProcessing: boolean;
}

export function VoiceControls({ isListening, toggleListening, disabled, aiProcessing }: VoiceControlsProps) {
  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled || aiProcessing}
      className={cn(
        "p-1.5 rounded-xl transition-all duration-300 border",
        isListening 
          ? "bg-black text-white border-white/20" 
          : "text-black/80 hover:bg-black/10 border-black/20",
        disabled && "opacity-50 cursor-not-allowed",
        "dark:border-white/20 dark:text-white/80"
      )}
    >
      <Mic className="w-4 h-4" />
      <span className="sr-only">Toggle voice input</span>
    </button>
  );
}
