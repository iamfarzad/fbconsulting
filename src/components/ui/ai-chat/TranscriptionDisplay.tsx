
import React from "react";
import { AnimatedBars } from "../AnimatedBars";
import { cn } from "@/lib/utils";

interface TranscriptionDisplayProps {
  isTranscribing: boolean;
  isListening: boolean;
  transcript: string;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  isTranscribing,
  isListening,
  transcript
}) => {
  if (!isListening && !isTranscribing) return null;

  return (
    <div className="mb-2 relative overflow-hidden">
      <div className={cn(
        "bg-white/95 backdrop-blur-lg border border-black/20 rounded-2xl p-3 text-sm",
        "flex items-center gap-3 transition-all duration-300 animate-fade-in",
        isTranscribing ? "text-black/70" : "text-black"
      )}>
        <div className="flex-shrink-0">
          <AnimatedBars isActive={isListening} small />
        </div>
        <div className="flex-1 line-clamp-1">
          {isTranscribing 
            ? "Processing..." 
            : transcript || "Listening..."}
        </div>
      </div>
    </div>
  );
}
