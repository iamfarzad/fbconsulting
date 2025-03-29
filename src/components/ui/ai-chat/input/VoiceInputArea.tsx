
import React from 'react';
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInputAreaProps {
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  isDisabled?: boolean;
}

export const VoiceInputArea: React.FC<VoiceInputAreaProps> = ({
  isListening,
  transcript,
  toggleListening,
  isDisabled = false
}) => {
  if (!transcript && !isListening) return null;
  
  return (
    <div className="mb-2">
      <div className={cn(
        "p-2 rounded-md text-sm bg-black/5 dark:bg-white/5 flex items-center gap-2",
        isListening && "border-l-4 border-primary animate-pulse"
      )}>
        {isListening ? (
          <Mic className="h-4 w-4 text-primary" />
        ) : (
          <MicOff className="h-4 w-4 text-muted-foreground" />
        )}
        <div className="flex-1">
          {isListening ? (
            <p>Listening... <span className="text-primary font-medium">{transcript}</span></p>
          ) : (
            <p className="text-muted-foreground">{transcript}</p>
          )}
        </div>
        <button 
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={toggleListening}
          disabled={isDisabled}
        >
          {isListening ? 'Stop' : 'Try again'}
        </button>
      </div>
    </div>
  );
};
