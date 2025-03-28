
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Mic, Image } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PopoverMenuProps {
  onMicClick?: () => void;
  onImageClick?: () => void;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  onMicClick,
  onImageClick
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="space-y-2">
          <div className="text-sm font-medium mb-2">Actions</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-sm"
            onClick={onMicClick}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice Input
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-sm"
            onClick={onImageClick}
          >
            <Image className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMenu;
