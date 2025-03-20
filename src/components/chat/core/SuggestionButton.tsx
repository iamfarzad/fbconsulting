
import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  className = '',
}) => {
  // Truncate suggestion if it's too long
  const truncatedSuggestion = suggestion.length > 30
    ? `${suggestion.substring(0, 30)}...`
    : suggestion;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 text-xs flex items-center gap-1 bg-primary/5 border-primary/20 hover:bg-primary/10',
              className
            )}
          >
            <Sparkles size={12} className="text-primary" />
            <span className="truncate max-w-[120px]">{truncatedSuggestion}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{suggestion}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
