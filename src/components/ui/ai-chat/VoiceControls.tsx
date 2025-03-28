
import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  aiProcessing?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  toggleListening,
  disabled = false,
  aiProcessing = false
}) => {
  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
        isListening
          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
          : aiProcessing
            ? "bg-yellow-500 text-white shadow-md"
            : "bg-black dark:bg-white text-white dark:text-black shadow-md hover:shadow-lg"
      )}
    >
      {aiProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
      )}
      <span className="sr-only">
        {isListening ? "Stop listening" : aiProcessing ? "Processing..." : "Start voice input"}
      </span>
    </button>
  );
};

export default VoiceControls;
