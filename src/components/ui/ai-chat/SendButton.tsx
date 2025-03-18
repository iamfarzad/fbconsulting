
import React from 'react';
import { ArrowUpIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SendButtonProps {
  hasContent: boolean;
  isLoading: boolean;
  aiProcessing: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SendButton({
  hasContent,
  isLoading,
  aiProcessing,
  disabled,
  onClick
}: SendButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "p-1.5 rounded-md text-xs transition-colors border flex items-center justify-center",
        hasContent && !isLoading
          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
          : "text-foreground border-foreground/30",
        (isLoading || aiProcessing) && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={!hasContent || isLoading || disabled || aiProcessing}
    >
      {isLoading || aiProcessing ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <ArrowUpIcon
          className={cn(
            "w-3.5 h-3.5",
            hasContent && !isLoading
              ? "text-white dark:text-black"
              : "text-foreground"
          )}
        />
      )}
      <span className="sr-only">Send</span>
    </button>
  );
}
