
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectionStatus } from './ConnectionStatus';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  isConnected?: boolean;
  clientId?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "AI Assistant",
  subtitle,
  onClose,
  isConnected = false,
  clientId
}) => {
  return (
    <div className="border-b pb-2">
      <div className="flex justify-between items-center p-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-4">
          {clientId && (
            <div className="flex items-center space-x-2">
              <ConnectionStatus isConnected={isConnected} />
              <span className="text-xs text-muted-foreground">ID: {clientId.substring(0, 8)}</span>
            </div>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
