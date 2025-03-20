
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  className
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 text-xs ${className}`}
    >
      <Lightbulb size={12} />
      <span className="truncate max-w-[200px]">{suggestion}</span>
    </Button>
  );
};
