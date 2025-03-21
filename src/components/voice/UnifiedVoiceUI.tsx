<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { useVoiceService } from '@/hooks/useVoiceService';
import { cn } from '@/lib/utils';

interface UnifiedVoiceUIProps {
  onCommand?: (command: string) => void;
  aiProcessing?: boolean;
  showTranscript?: boolean;
  compact?: boolean;
  className?: string;
}

export const UnifiedVoiceUI: React.FC<UnifiedVoiceUIProps> = ({
  onCommand,
  aiProcessing = false,
  showTranscript = true,
  compact = false,
  className
}) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const {
    isListening,
    transcript,
    toggleListening,
    recognitionError,
    recognitionSupported,
    speak,
    stopSpeaking
  } = useVoiceService({
    onTranscriptComplete: (finalText) => {
      if (onCommand && finalText.trim()) {
        onCommand(finalText);
      }
    }
  });
  
  // Effect to handle mute state
  useEffect(() => {
    if (isMuted) {
      stopSpeaking();
    }
  }, [isMuted, stopSpeaking]);
  
  if (!recognitionSupported) {
    return null;
  }
  
  return (
    <div className={cn("voice-ui flex flex-col items-center space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size={compact ? "sm" : "default"}
          className={`rounded-full p-2 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
          onClick={toggleListening}
          disabled={aiProcessing}
        >
          {isListening ? (
            <MicOff className={compact ? "h-4 w-4" : "h-5 w-5"} />
          ) : (
            <Mic className={compact ? "h-4 w-4" : "h-5 w-5"} />
          )}
          <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
        </Button>
        
        <Button
          variant="ghost"
          size={compact ? "sm" : "default"}
          className="rounded-full p-2"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className={compact ? "h-4 w-4" : "h-5 w-5"} />
          ) : (
            <Volume2 className={compact ? "h-4 w-4" : "h-5 w-5"} />
          )}
          <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
        </Button>
      </div>
      
      {isListening && (
        <AnimatePresence>
          <motion.div 
            className="voice-active-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <AnimatedBars isActive={true} small={compact} />
          </motion.div>
        </AnimatePresence>
      )}
      
      {showTranscript && transcript && isListening && (
        <AnimatePresence>
          <motion.div 
            className="transcript-display max-w-md text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {transcript}
          </motion.div>
        </AnimatePresence>
      )}
      
      {recognitionError && (
        <div className="error-message text-xs text-red-500">
          {recognitionError}
        </div>
=======
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
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
      )}
    </div>
  );
};

export default UnifiedVoiceUI;
