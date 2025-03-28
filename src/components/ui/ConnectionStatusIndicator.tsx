
import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectionStatusIndicatorProps } from '@/types/chat';

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  isConnected = true,
  isLoading,
  className = '',
  status,
  onRetry
}) => {
  // If we have the new status prop, use that, otherwise use isConnected
  const connectionStatus = status || (isConnected ? 'connected' : 'disconnected');
  const isConnecting = connectionStatus === 'connecting' || isLoading;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-md text-sm ${className}`}>
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Connecting...</span>
        </>
      ) : connectionStatus === 'connected' ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Connected</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-destructive">Disconnected</span>
          
          {onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRetry} 
              className="h-6 p-1 ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              <span className="text-xs">Retry</span>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
