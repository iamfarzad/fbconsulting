
import React from 'react';
import { PlusIcon } from 'lucide-react';

interface SuggestionButtonProps {
  suggestion: string;
  onClick: () => void;
  disabled: boolean;
}

export function SuggestionButton({ suggestion, onClick, disabled }: SuggestionButtonProps) {
  return (
    <button
      type="button"
      className="px-1.5 py-1 rounded-md text-xs text-black/80 transition-colors border border-dashed border-black/30 hover:border-black/60 hover:bg-black/5 flex items-center justify-between gap-1"
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon className="w-3 h-3" />
      Suggestion
    </button>
  );
}
