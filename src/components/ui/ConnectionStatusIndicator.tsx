
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ConnectionStatusIndicatorProps {
  status?: 'connected' | 'connecting' | 'disconnected' | 'error';
  isConnected?: boolean;
  isLoading?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ConnectionStatusIndicator({
  isConnected,
  isLoading,
  className = '',
  onRetry
}: ConnectionStatusIndicatorProps) {
  // Choose the icon and message based on the status
  let icon = isConnected ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />;
  let message = isConnected ? "Connected" : "Disconnected";
  
  if (isLoading) {
    icon = <Loader2 size={16} className="animate-spin text-blue-500" />;
    message = "Connecting...";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center ${className}`}>
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <span>{message}</span>
            {!isConnected && !isLoading && onRetry && (
              <button 
                onClick={onRetry} 
                className="text-xs underline hover:text-blue-600 mt-1"
              >
                Retry connection
              </button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
