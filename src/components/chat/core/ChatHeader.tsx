
import React from 'react';
import { X, MinusSquare, Maximize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'AI Assistant',
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen = false,
  isConnected = true,
  isLoading = false,
}) => {
  return (
    <div className="border-b p-3 flex justify-between items-center bg-background/90 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <div className="flex items-center gap-1.5">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {isLoading && <AnimatedBars isActive={true} small={true} />}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8"
            title="Clear conversation"
          >
            <Trash2 size={16} />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            className="h-8 w-8"
            title={isFullScreen ? "Minimize" : "Maximize"}
          >
            {isFullScreen ? <MinusSquare size={16} /> : <Maximize2 size={16} />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
