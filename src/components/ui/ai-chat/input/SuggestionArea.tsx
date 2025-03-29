
import React from 'react';

interface SuggestionAreaProps {
  suggestion: string | null;
  onSuggestionClick: () => void;
}

export const SuggestionArea: React.FC<SuggestionAreaProps> = ({
  suggestion,
  onSuggestionClick
}) => {
  if (!suggestion) return null;
  
  return (
    <div className="mb-2">
      <button 
        className="p-2 rounded-md text-sm bg-black/5 dark:bg-white/5 w-full text-left hover:bg-black/10 dark:hover:bg-white/10"
        onClick={onSuggestionClick}
      >
        <p className="text-xs text-muted-foreground mb-1">Suggested response:</p>
        <p className="line-clamp-2">{suggestion}</p>
      </button>
    </div>
  );
};
