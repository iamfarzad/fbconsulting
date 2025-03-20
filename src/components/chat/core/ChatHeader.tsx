
import React from 'react';
import { X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen = false,
  isConnected = true,
  isLoading = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background rounded-t-lg">
      <div className="flex items-center">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center space-x-2">
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            {isLoading && <AnimatedBars isActive={true} small={true} />}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            className="h-8 w-8"
            title={isFullScreen ? "Minimize" : "Full screen"}
          >
            {isFullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
