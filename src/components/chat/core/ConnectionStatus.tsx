
import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  className?: string;
}

export function ConnectionStatus({ isConnected, isLoading, className }: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center", className)}>
      {isLoading ? (
        <div className="flex items-center text-yellow-500">
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          <span className="text-xs">Connecting...</span>
        </div>
      ) : isConnected ? (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Connected</span>
        </div>
      ) : (
        <div className="flex items-center text-red-500">
          <XCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">Disconnected</span>
        </div>
      )}
    </div>
  );
}
