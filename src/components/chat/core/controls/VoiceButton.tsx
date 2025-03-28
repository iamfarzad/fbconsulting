
import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onClick: () => void;
  isListening: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onClick, 
  isListening, 
  disabled = false,
  isLoading = false
}) => {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "h-8 w-8",
        isListening && "text-red-500",
        disabled && "opacity-50"
      )}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
      )}
    </Button>
  );
};

export default VoiceButton;
