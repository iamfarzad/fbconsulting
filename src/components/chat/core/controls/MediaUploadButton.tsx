
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Paperclip, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MediaUploadButtonProps {
  showMedia: boolean;
  onToggleMedia: () => void;
  isLoading: boolean;
  isListening: boolean;
}

export const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({
  showMedia,
  onToggleMedia,
  isLoading,
  isListening,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleMedia}
            className={cn(
              'rounded-full w-8 h-8',
              showMedia && 'bg-primary/10 text-primary'
            )}
            disabled={isLoading || isListening}
          >
            {showMedia ? (
              <X className="h-4 w-4" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{showMedia ? 'Hide media options' : 'Add files'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
