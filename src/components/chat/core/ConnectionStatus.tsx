
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isLoading = false,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      ) : (
        <div 
          className={cn(
            "h-2 w-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        />
      )}
      <span className="text-xs text-muted-foreground">
        {isLoading ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
