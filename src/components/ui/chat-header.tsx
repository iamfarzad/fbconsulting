import React from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  onClear?: () => void;
  onToggleFullScreen?: () => void;
  isFullScreen?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
}

export function ChatHeader({
  title = 'Chat',
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen,
  isConnected = false,
  isLoading = false,
}: ChatHeaderProps) {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
              {isLoading && '...'}
            </p>
          )}
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex items-center space-x-2">
        {onClear && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Clear chat"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {onToggleFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullScreen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
