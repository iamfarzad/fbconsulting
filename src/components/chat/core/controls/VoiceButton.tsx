
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  isVoiceSupported?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggle,
  isLoading = false,
  isVoiceSupported = false
}) => {
  if (!isVoiceSupported) return null;
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={isLoading}
      className={cn(
        "h-9 w-9 rounded-full",
        isListening ? "text-destructive bg-destructive/10" : "text-muted-foreground"
      )}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isListening ? "Stop voice recording" : "Start voice recording"}
      </span>
    </Button>
  );
};

export default VoiceButton;
