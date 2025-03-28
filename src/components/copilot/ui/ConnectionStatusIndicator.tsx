
import React from 'react';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectionStatusIndicatorProps } from '@/types/chat';

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
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-500">Connected</span>
        </>
      )}
      
      {connectionStatus === 'connecting' && (
        <>
          <Loader2 className="h-3 w-3 text-amber-500 animate-spin" />
          <span className="text-xs text-amber-500">Connecting...</span>
        </>
      )}
      
      {connectionStatus === 'disconnected' && (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <span className="text-xs text-red-500">Disconnected</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-1 p-0.5 rounded-sm hover:bg-muted"
              aria-label="Retry connection"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
