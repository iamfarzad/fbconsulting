
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  isConnected: boolean;
  isMockData: boolean;
  className?: string;
}

export function ConnectionStatus({ isConnected, isMockData, className }: ConnectionStatusProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5 text-xs", className)}>
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                <span className={cn(
                  "font-medium",
                  isMockData ? "text-amber-500" : "text-green-500"
                )}>
                  {isMockData ? "Demo Mode" : "Connected"}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-500 font-medium">Offline</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isConnected ? (
            isMockData ? (
              <div className="flex flex-col gap-1">
                <p>Using demo responses (mock data)</p>
                <p className="text-xs text-muted-foreground">Set up Gemini API Key for real responses</p>
              </div>
            ) : (
              <p>Connected to Google Gemini API</p>
            )
          ) : (
            <p>Not connected to AI service</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
