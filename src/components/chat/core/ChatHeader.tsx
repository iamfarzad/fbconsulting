
import React from 'react';
import { Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeaderProps } from '@/types/chat';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen = false,
  isConnected = true,
  isLoading = false
}) => {
  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium flex items-center">
          {title}
          {isLoading && (
            <span className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          )}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
            {!isConnected && (
              <span className="text-destructive ml-1">(Disconnected)</span>
            )}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-1">
        {onClear && (
          <Button
            variant="ghost" 
            size="icon"
            onClick={onClear}
            title="Clear chat"
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Minimize" : "Maximize"}
            className="h-8 w-8"
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

export default ChatHeader;
