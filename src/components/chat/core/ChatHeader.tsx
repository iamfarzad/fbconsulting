
import React from 'react';
import { Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeaderProps } from '@/types/chat';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen,
  isConnected,
  isLoading
}) => {
  return (
    <div className="border-b p-3 flex justify-between items-center bg-background">
      <div className="flex flex-col">
        <h3 className="font-semibold text-sm flex items-center">
          {title}
          {isConnected && (
            <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {!isConnected && !isLoading && (
            <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
          )}
          {isLoading && (
            <span className="ml-2 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex space-x-1">
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-7 w-7"
            title="Clear chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            className="h-7 w-7"
            title={isFullScreen ? "Minimize" : "Maximize"}
          >
            {isFullScreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
