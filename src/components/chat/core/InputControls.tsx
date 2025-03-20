
import React from 'react';
import { Send, Image, Mic, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InputControlsProps {
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  onToggleMic?: () => void;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  onToggleMedia?: () => void;
  showMedia?: boolean;
  isMediaUploading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const InputControls: React.FC<InputControlsProps> = ({
  onSend,
  hasContent,
  isLoading,
  onToggleMic,
  isListening = false,
  isVoiceSupported = false,
  onToggleMedia,
  showMedia = false,
  isMediaUploading = false,
  disabled = false,
  className
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onToggleMedia && (
        <Button
          type="button"
          size="icon"
          variant={showMedia ? "default" : "ghost"}
          onClick={onToggleMedia}
          disabled={disabled || isLoading}
          className="h-9 w-9"
        >
          <Image size={18} />
        </Button>
      )}
      
      {isVoiceSupported && onToggleMic && (
        <Button
          type="button"
          size="icon"
          variant={isListening ? "default" : "ghost"}
          onClick={onToggleMic}
          disabled={disabled || isLoading}
          className="h-9 w-9"
        >
          <Mic size={18} />
        </Button>
      )}
      
      <Button
        type="button"
        variant="default"
        onClick={onSend}
        disabled={!hasContent || isLoading || disabled || isMediaUploading}
        className="h-9 px-3"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
      </Button>
    </div>
  );
};
