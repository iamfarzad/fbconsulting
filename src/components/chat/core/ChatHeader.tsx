
import React from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeaderProps } from '@/types/chat';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "AI Assistant",
  onClose,
  onClear,
  hasMessages = false,
  subtitle,
  onToggleFullScreen,
  isFullScreen,
  isConnected,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-4 p-3 border-b">
      <div>
        <h3 className="font-medium text-base">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-1">
        {isConnected !== undefined && (
          <div className="mr-2 flex items-center">
            <div 
              className={`w-2 h-2 rounded-full mr-1 ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        )}
        
        {hasMessages && onClear && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            disabled={isLoading}
            className="text-xs"
          >
            Clear
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFullScreen}
            className="h-8 w-8"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
