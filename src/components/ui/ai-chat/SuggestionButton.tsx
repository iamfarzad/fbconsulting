
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
      className="px-2 py-1 rounded-lg text-sm text-black/80 transition-colors border border-dashed border-black/30 hover:border-black/60 hover:bg-black/10 flex items-center justify-between gap-1"
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon className="w-4 h-4" />
      Suggestion
    </button>
  );
}
