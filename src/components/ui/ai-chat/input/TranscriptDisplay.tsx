
import React from 'react';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';

interface TranscriptDisplayProps {
  isListening: boolean;
  transcript: string;
  className?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  isListening,
  transcript,
  className
}) => {
  if (!isListening && !transcript) return null;
  
  return (
    <div className={cn(
      "relative mb-2 p-3 border rounded-md bg-muted/50",
      "flex items-center gap-2",
      className
    )}>
      {isListening && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mic className="h-4 w-4 animate-pulse text-primary" />
          <span>Listening...</span>
        </div>
      )}
      
      {!isListening && transcript && (
        <div className="text-foreground">
          <p className="text-sm italic">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
