
import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedBars } from '../ui/AnimatedBars';

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
  aiProcessing = false
}) => {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          "rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-2",
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110"
            : aiProcessing
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-black dark:bg-white text-white dark:text-black shadow-md hover:shadow-lg hover:scale-105"
        )}
      >
        {aiProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Mic className={cn("h-6 w-6", isListening && "animate-pulse")} />
        )}
        <span className="sr-only">
          {isListening ? "Stop listening" : aiProcessing ? "Processing..." : "Start voice input"}
        </span>
      </button>
      
      {isListening && (
        <div className="mt-2">
          <AnimatedBars isActive={true} small={true} />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2">
        {isListening 
          ? "Listening..." 
          : aiProcessing 
            ? "Processing..." 
            : "Click to speak"}
      </p>
    </div>
  );
};

export default DemoVoiceControls;
