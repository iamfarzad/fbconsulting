
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { Button } from '@/components/ui/button';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { VoiceUIProps } from '@/types/voice';

export const VoiceUI: React.FC<VoiceUIProps> = ({ 
  onCommand,
  aiProcessing = false
}) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const {
    isListening,
    transcript,
    toggleListening,
    error,
    isSupported
  } = useVoiceRecognition({
    onFinalResult: (text) => {
      if (onCommand && text.trim()) {
        onCommand(text);
      }
    },
    continuous: false,
    language: 'en-US'
  });
  
  if (!isSupported) {
    return null;
  }
  
  return (
    <div className="voice-ui flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full p-2 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
          onClick={toggleListening}
          disabled={aiProcessing}
        >
          {isListening ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
          <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full p-2"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
        </Button>
      </div>
      
      {isListening && (
        <div className="voice-active-indicator">
          <AnimatedBars isActive={true} />
        </div>
      )}
      
      {transcript && isListening && (
        <div className="transcript-display max-w-md text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded">
          {transcript}
        </div>
      )}
      
      {error && (
        <div className="error-message text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceUI;
