
import React from 'react';
import { Sparkles, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConnectionStatus } from '@/components/ui/ai-chat/ConnectionStatus';

interface ChatHeaderProps {
  personaName?: string;
  isLoading: boolean;
  messagesCount: number;
  onClear: () => void;
  // Add these props
  isUsingMockData?: boolean;
  isConnected?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  personaName = 'AI Assistant',
  isLoading,
  messagesCount,
  onClear,
  isUsingMockData = false,
  isConnected = true
}) => {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-medium">{personaName}</span>
        
        {/* Add connection status */}
        <ConnectionStatus 
          isConnected={isConnected} 
          isMockData={isUsingMockData} 
          className="ml-2" 
        />
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                disabled={messagesCount === 0 || isLoading}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <a href="/about" target="_blank" rel="noopener noreferrer">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">About</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Learn more about this AI assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
