
import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
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
        <div className="flex items-center text-amber-500" title="Connecting...">
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          <span className="text-xs">Connecting</span>
        </div>
      ) : isConnected ? (
        <div className="flex items-center text-green-500" title="Connected">
          <Wifi className="h-4 w-4 mr-1" />
          <span className="text-xs">Connected</span>
        </div>
      ) : (
        <div className="flex items-center text-red-500" title="Disconnected">
          <WifiOff className="h-4 w-4 mr-1" />
          <span className="text-xs">Offline</span>
        </div>
      )}
    </div>
  );
}
