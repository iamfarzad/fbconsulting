
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isLoading = false
}) => {
  const getStatusColor = () => {
    if (isLoading) return 'bg-amber-500';
    return isConnected ? 'bg-green-500' : 'bg-red-500';
  };
  
  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    return isConnected ? 'Connected' : 'Disconnected';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getStatusText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
