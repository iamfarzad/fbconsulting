
import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionButtonProps {
  suggestion: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const SuggestionButton: React.FC<SuggestionButtonProps> = ({
  suggestion,
  onClick,
  disabled = false,
  className,
}) => {
  // Truncate suggestion if too long
  const truncatedSuggestion = suggestion.length > 30 
    ? `${suggestion.substring(0, 30)}...` 
    : suggestion;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-black/5 dark:bg-white/5 rounded-full",
        "hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
        "text-black/80 dark:text-white/80",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Sparkles className="h-3 w-3" />
      <span>{truncatedSuggestion}</span>
    </button>
  );
};
