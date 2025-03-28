
import React from 'react';
import { Maximize2, Minimize2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center space-x-2">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            {isLoading && (
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            )}
            {subtitle || (isConnected ? 'Connected' : 'Offline')}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onClear && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClear}
            title="Clear chat"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Exit full screen" : "Full screen"}
          >
            {isFullScreen ? 
              <Minimize2 className="h-4 w-4" /> : 
              <Maximize2 className="h-4 w-4" />
            }
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
