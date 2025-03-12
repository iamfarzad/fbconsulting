
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
        "px-1.5 py-1.5 rounded-lg text-sm transition-colors border hover:border-foreground flex items-center justify-between gap-1",
        hasContent && !isLoading
          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
          : "text-foreground border-foreground/30",
        (isLoading || aiProcessing) && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={!hasContent || isLoading || disabled || aiProcessing}
    >
      {isLoading || aiProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ArrowUpIcon
          className={cn(
            "w-4 h-4",
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
