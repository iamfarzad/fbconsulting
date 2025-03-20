
import React from 'react';
import { Sparkles, Trash2, Info, Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConnectionStatus } from '@/components/chat/core/ConnectionStatus';

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isUsingMockData?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen = false,
  isConnected = true,
  isUsingMockData = false,
  isLoading = false,
  className
}) => {
  return (
    <div className={`px-4 py-3 border-b flex justify-between items-center ${className}`}>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></div>
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isUsingMockData && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center border rounded-full px-1.5 py-0.5 text-xs bg-amber-50 border-amber-200 text-amber-800">
                  <Info size={12} className="mr-1" />
                  <span>Demo Mode</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Using demo responses. Set up an API key for full functionality.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            title="Clear chat"
          >
            <Trash2 size={16} />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Minimize" : "Expand"}
          >
            {isFullScreen ? <Minimize size={16} /> : <Expand size={16} />}
          </Button>
        )}
      </div>
    </div>
  );
};
