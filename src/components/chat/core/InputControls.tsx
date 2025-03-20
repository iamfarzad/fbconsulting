
import React from 'react';
import { Send, Mic, MicOff, Image, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputControlsProps {
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  onToggleMic?: () => void;
  isListening?: boolean;
  isVoiceSupported?: boolean;
  onToggleMedia?: () => void;
  showMedia?: boolean;
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
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Media button */}
      {onToggleMedia && (
        <button
          type="button"
          className={cn(
            "p-2 rounded-full transition-colors",
            showMedia ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          )}
          onClick={onToggleMedia}
          disabled={isLoading || isListening}
        >
          {showMedia ? <X size={18} /> : <Image size={18} />}
        </button>
      )}
      
      {/* Voice button */}
      {isVoiceSupported && onToggleMic && (
        <button
          type="button"
          className={cn(
            "p-2 rounded-full transition-colors",
            isListening ? "bg-primary text-primary-foreground animate-pulse" : "hover:bg-muted"
          )}
          onClick={onToggleMic}
          disabled={isLoading}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      )}
      
      {/* Send button */}
      <button
        type="button"
        className={cn(
          "p-2 rounded-full transition-colors",
          hasContent && !isLoading ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          (!hasContent || isLoading) ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
        )}
        onClick={onSend}
        disabled={!hasContent || isLoading || isListening}
      >
        {isLoading ? (
          <span className="animate-spin">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          <Send size={18} />
        )}
      </button>
    </div>
  );
};
