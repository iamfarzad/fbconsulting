
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectionStatusIndicatorProps {
  isConnected?: boolean;
  isLoading?: boolean;
  status?: string;
  onRetry?: () => void;
  className?: string;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  isConnected = false,
  isLoading = false,
  status = '',
  onRetry,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isConnected ? (
        <Wifi className="h-4 w-4 text-green-500" />
      ) : (
        <WifiOff className="h-4 w-4 text-destructive" />
      )}
      
      <span className="text-xs text-muted-foreground">
        {isLoading
          ? "Connecting..."
          : isConnected
            ? status || "Connected"
            : status || "Disconnected"}
      </span>
      
      {!isConnected && !isLoading && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
