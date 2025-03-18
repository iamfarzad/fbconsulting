
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedBars } from "@/components/ui/AnimatedBars";

interface TranscriptionDisplayProps {
  isTranscribing: boolean;
  isListening: boolean;
  transcript: string;
}

export function TranscriptionDisplay({
  isTranscribing,
  isListening,
  transcript
}: TranscriptionDisplayProps) {
  return (
    <div 
      className={cn(
        "overflow-hidden transition-all duration-500 ease-in-out bg-black/95 backdrop-blur-lg text-white rounded-2xl mb-2",
        isTranscribing ? "max-h-24 opacity-100 py-3 px-4 border border-white/20" : "max-h-0 opacity-0 py-0 px-0"
      )}
    >
      <div className={cn(
        "flex items-center gap-2 transition-transform duration-500",
        isTranscribing ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex-shrink-0">
          <AnimatedBars isActive={isListening} small={false} />
        </div>
        <p className="text-sm font-medium animate-fade-in-up">
          {transcript || "Listening..."}
        </p>
      </div>
    </div>
  );
}
