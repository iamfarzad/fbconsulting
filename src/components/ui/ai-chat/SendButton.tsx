
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
        "px-1.5 py-1.5 rounded-lg text-sm transition-colors border hover:border-black flex items-center justify-between gap-1",
        hasContent && !isLoading
          ? "bg-black text-white border-black"
          : "text-black/80 border-black/30",
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
              ? "text-white"
              : "text-black/80"
          )}
        />
      )}
      <span className="sr-only">Send</span>
    </button>
  );
}
