import React from 'react';
import { Bot, X, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeaderProps } from '@/types/chat';
// Update the import path to match where you actually created the component
import { ConnectionStatusIndicator } from '../ui/ConnectionStatusIndicator';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'AI Assistant',
  subtitle,
  onClose,
  onClear,
  hasMessages = false,
  isConnected,
  isConnecting
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        <Bot className="h-5 w-5 text-primary" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {/* Update prop name to match what the component expects */}
            {isConnected !== undefined && (
              <ConnectionStatusIndicator 
                isConnected={isConnected} 
                isConnecting={isConnecting}
              />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {hasMessages && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
