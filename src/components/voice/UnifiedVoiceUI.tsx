
import React, { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Mic, Pause, Play, StopCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface UnifiedVoiceUIProps {
  isListening: boolean;
  toggleListening: () => void;
  isPlaying: boolean;
  progress: number;
  stopAudio: () => void;
  onVoiceInput: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export const UnifiedVoiceUI: React.FC<UnifiedVoiceUIProps> = ({
  isListening,
  toggleListening,
  isPlaying,
  progress,
  stopAudio,
  onVoiceInput,
  className,
  disabled = false
}) => {
  const {
    transcript,
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition((command) => {
    if (command.trim()) {
      onVoiceInput(command);
    }
  });

  useEffect(() => {
    if (!isVoiceSupported) {
      console.warn('Voice recognition not supported');
    }
  }, [isVoiceSupported]);

  if (!isVoiceSupported) return null;

  return (
    <div className={cn("flex items-center gap-2 relative min-h-[36px]", className)}>
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          "relative",
          isListening && "bg-red-500 hover:bg-red-600"
        )}
      >
        <Mic className={cn(
          "h-4 w-4",
          isListening && "animate-pulse"
        )} />
      </Button>

      {isPlaying && (
        <Button
          variant="outline"
          size="icon"
          onClick={stopAudio}
          disabled={disabled}
          className="relative"
        >
          <StopCircle className="h-4 w-4" />
        </Button>
      )}

      {(isListening || isPlaying) && (
        <Progress 
          value={isListening ? undefined : progress} 
          className="w-[100px]"
          aria-label="Audio progress"
        />
      )}
      
      {voiceError && (
        <p className="text-xs text-red-500 absolute -bottom-6 left-0">
          {voiceError}
        </p>
      )}
    </div>
  );
};

export default UnifiedVoiceUI;
