import React from 'react';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionStatusIndicatorProps } from '@/types/chat';
import { Button } from '@/components/ui/button';

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  isConnected = false,
  isLoading = false,
  className = '',
  status,
  onRetry
}) => {
  // Determine status from props if not explicitly provided
  const connectionStatus = status || (isConnected ? 'connected' : isLoading ? 'connecting' : 'disconnected');
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {connectionStatus === 'connected' && (
        <div className="flex items-center text-green-500">
          <Wifi className="h-3 w-3 mr-1" />
          <span className="text-xs">Connected</span>
        </div>
      )}
      
      {connectionStatus === 'connecting' && (
        <div className="flex items-center text-amber-500">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span className="text-xs">Connecting...</span>
        </div>
      )}
      
      {connectionStatus === 'disconnected' && (
        <div className="flex items-center text-red-500">
          <WifiOff className="h-3 w-3 mr-1" />
          <span className="text-xs">Disconnected</span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="ml-1 h-6 p-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="sr-only">Retry connection</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
