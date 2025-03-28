
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, isLoading = false }) => {
  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
    } else if (isConnected) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (isLoading) {
      return "Connecting...";
    } else if (isConnected) {
      return "Connected to AI service";
    } else {
      return "Disconnected from AI service";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getStatusText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
