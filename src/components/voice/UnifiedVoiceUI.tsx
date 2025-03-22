
import React, { useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Mic, Pause, Play, StopCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import useGeminiAudioPlayback from '@/hooks/gemini/useGeminiAudioPlayback';

interface UnifiedVoiceUIProps {
  isListening: boolean;
  toggleListening: () => void;
  isPlaying: boolean;
  progress: number;
  stopAudio: () => void;
  onVoiceInput: (text: string) => void;
  onGenerateAudio?: (text: string) => Promise<Blob | null>;
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
  onGenerateAudio,
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

  const { 
    playAudio,
    error: audioError
  } = useGeminiAudioPlayback({
    onPlaybackComplete: () => {
      console.log('Audio playback completed');
    }
  });

  const [pendingText, setPendingText] = useState<string>('');

  // Handle text-to-speech request
  const handleTTS = async (text: string) => {
    if (!onGenerateAudio || !text.trim()) return;
    
    try {
      setPendingText(text);
      const audioBlob = await onGenerateAudio(text);
      setPendingText('');
      
      if (audioBlob) {
        await playAudio(audioBlob);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setPendingText('');
    }
  };

  const handleVoiceCommand = useCallback((command: string) => {
    if (command.trim()) {
      onVoiceInput(command);
    }
  }, [onVoiceInput]);

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

      {onGenerateAudio && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleTTS(transcript || pendingText || 'Hello, this is a test of the Gemini TTS system.')}
          disabled={disabled || isPlaying || !onGenerateAudio}
          className="relative"
        >
          <Play className="h-4 w-4" />
        </Button>
      )}

      {(isListening || isPlaying) && (
        <Progress 
          value={isListening ? undefined : progress} 
          className="w-[100px]"
          aria-label="Audio progress"
        />
      )}
      
      {(voiceError || audioError) && (
        <p className="text-xs text-red-500 absolute -bottom-6 left-0">
          {voiceError || audioError}
        </p>
      )}
    </div>
  );
};

export default UnifiedVoiceUI;
