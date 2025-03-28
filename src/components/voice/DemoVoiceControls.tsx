
import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoVoiceControlsProps {
  isListening: boolean;
  toggleListening: () => void;
  disabled?: boolean;
  aiProcessing?: boolean;
  className?: string;
}

export const DemoVoiceControls: React.FC<DemoVoiceControlsProps> = ({
  isListening,
  toggleListening,
  disabled = false,
  aiProcessing = false,
  className = '',
}) => {
  return (
    <Button
      onClick={toggleListening}
      disabled={disabled}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
      variant={isListening ? 'destructive' : 'default'}
      size="icon"
      className={`rounded-full w-12 h-12 ${className}`}
    >
      {aiProcessing ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
};

export default DemoVoiceControls;
