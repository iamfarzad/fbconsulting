
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { AnimatedBars } from '../AnimatedBars';
import { cn } from '@/lib/utils';

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
    <button
      type="button"
      onClick={toggleListening}
      className={cn(
        "p-2 rounded-lg transition-all duration-300 flex items-center gap-1",
        isListening 
          ? "bg-black text-white animate-pulse-subtle" 
          : "text-black/70 hover:bg-black/10",
        (disabled || aiProcessing) && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled || aiProcessing}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <AnimatedBars isActive={true} small={true} />
        </>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
