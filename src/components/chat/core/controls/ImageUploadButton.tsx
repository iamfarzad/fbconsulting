
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ImageUploadButtonProps {
  onImageUpload: () => void;
  isLoading: boolean;
  isListening: boolean;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onImageUpload,
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
            onClick={onImageUpload}
            className="rounded-full w-8 h-8"
            disabled={isLoading || isListening}
          >
            <Image className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload image</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
