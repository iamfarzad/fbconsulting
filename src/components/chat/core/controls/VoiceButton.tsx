
import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface VoiceButtonProps {
  isListening: boolean;
  isVoiceSupported: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  isListening, 
  isVoiceSupported,
  isLoading = false,
  disabled = false,
  onToggle
}) => {
  if (!isVoiceSupported) return null;

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={onToggle}
      disabled={disabled || isLoading}
      className={`h-8 w-8 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceButton;
