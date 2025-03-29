
import React from 'react';
import { CheckCircle, XCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Correct the import path
import API_CONFIG from '@/config/apiConfigConfig'; 

interface ConnectionStatusProps {
  isConnected: boolean;
  isAttemptingReconnect: boolean;
  lastError: string | null;
  onReconnect?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isAttemptingReconnect, 
  lastError, 
  onReconnect 
}) => {
  let statusText = 'Connecting...';
  let Icon = Wifi;
  let iconColor = 'text-yellow-500';
  let tooltipContent = 'Attempting to connect to the server.';

  if (isConnected) {
    statusText = 'Connected';
    Icon = CheckCircle;
    iconColor = 'text-green-500';
    tooltipContent = 'Successfully connected to the server.';
  } else if (lastError) {
    statusText = 'Error';
    Icon = XCircle;
    iconColor = 'text-red-500';
    tooltipContent = `Connection failed: ${lastError}`;
  } else if (isAttemptingReconnect) {
    statusText = 'Reconnecting...';
    Icon = WifiOff;
    iconColor = 'text-orange-500';
    tooltipContent = 'Connection lost. Attempting to reconnect...';
  } else {
    statusText = 'Disconnected';
    Icon = WifiOff;
    iconColor = 'text-gray-500';
    tooltipContent = 'Not connected to the server.';
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center space-x-2 text-sm ${iconColor}`}>
            <Icon className="h-4 w-4" />
            <span>{statusText}</span>
            {!isConnected && onReconnect && (
              <Button 
                variant="outline"
                size="sm"
                onClick={onReconnect}
                className="ml-2 h-6 px-2 text-xs"
              >
                Retry
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
