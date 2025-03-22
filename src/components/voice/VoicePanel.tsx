
import React, { useEffect } from 'react';
import { Mic, MicOff, X, Volume2, VolumeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { AnimatedBars } from '../ui/AnimatedBars';
import { useGeminiService } from '@/hooks/gemini';
import { Progress } from '../ui/progress';
import { useMessage } from '@/contexts/MessageContext';
import useGeminiAudioPlayback from '@/hooks/gemini/useGeminiAudioPlayback';

interface VoicePanelProps {
  isListening: boolean;
  transcript: string;
  onClose: () => void;
  onToggleListening: () => void;
  aiResponse?: string;
}

export const VoicePanel: React.FC<VoicePanelProps> = ({
  isListening,
  transcript,
  onClose,
  onToggleListening,
  aiResponse,
}) => {
  const { error: serviceError, isLoading, progress } = useGeminiService();
  const { isPlaying, error: audioError, stopAudio, playAudio } = useGeminiAudioPlayback({
    onPlaybackError: console.error
  });

  const { message, audioEnabled, setAudioEnabled } = useMessage();

  useEffect(() => {
    // Automatically play audio when message is received in context
    if (message && audioEnabled) {
      const messageBlob = new Blob([message], { type: 'text/plain' });
      playAudio(messageBlob).catch(console.error);
    }
  }, [message, audioEnabled, playAudio]);

  const handleAudioControl = () => {
    if (isPlaying || isLoading) {
      stopAudio();
      setAudioEnabled(false);
    } else if (message) {
      setAudioEnabled(true);
      const messageBlob = new Blob([message], { type: 'text/plain' });
      playAudio(messageBlob).catch(console.error);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-24 right-6 p-4 bg-background border rounded-xl shadow-lg z-50 w-80"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground font-medium text-sm">Voice Assistant</h3>
          {(serviceError || audioError) && <span className="text-destructive text-xs">{serviceError || audioError}</span>}
        </div>
        <div className="flex gap-2">
          {message && (
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="w-24">
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAudioControl}
                className="h-7 w-7 rounded-full"
                disabled={!message}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : isPlaying ? (
                  <Volume2 className="h-4 w-4 text-primary" />
                ) : (
                  <VolumeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 rounded-full"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      
      <div className="text-muted-foreground text-sm mb-4">
        <p>Say commands like "show me your work" or "tell me about your services"</p>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <button 
          onClick={onToggleListening}
          className={`p-4 rounded-full ${isListening ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} transition-colors`}
        >
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>
        
        {isListening && (
          <div className="voice-waveform flex justify-center items-end h-8">
            <AnimatedBars isActive={isListening} />
          </div>
        )}
        
        {transcript && (
          <div className="p-3 bg-muted rounded-lg w-full">
            <p className="text-foreground text-sm">"{transcript}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
