
import React from 'react';
import { X, Maximize2, Minimize2, Trash2, CalendarIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBars } from '@/components/ui/AnimatedBars';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { ChatHeaderProps } from '@/types/chat';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "AI Assistant",
  subtitle,
  onClear,
  onToggleFullScreen,
  isFullScreen = false,
  isConnected = true,
  isLoading = false,
  category,
  date,
  readTime,
  author,
  authorTitle,
  authorAvatar,
}) => {
  const handleToggleFullScreen = () => {
    if (onToggleFullScreen) {
      onToggleFullScreen();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background rounded-t-lg">
      <div className="flex items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">{title}</h3>
            {/* Display connection status if relevant */}
            {isConnected !== undefined && (
              <ConnectionStatusIndicator 
                isConnected={isConnected} 
                isLoading={isLoading} 
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            {isLoading && <AnimatedBars isActive={true} small={true} />}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8"
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        {onToggleFullScreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFullScreen}
            className="h-8 w-8 hover:bg-muted"
            title={isFullScreen ? "Minimize" : "Full screen"}
            aria-label={isFullScreen ? "Minimize chat" : "Expand chat to full screen"}
          >
            {isFullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {category && (
        <div className="flex items-center mb-4">
          <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mr-3">
            {category}
          </span>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" /> 
            <span>{date}</span>
            <span className="mx-2">•</span>
            <ClockIcon className="h-4 w-4 mr-1" /> 
            <span>{readTime}</span>
          </div>
        </div>
      )}

      {author && (
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img 
              src={authorAvatar} 
              alt={author} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-sm text-muted-foreground">{authorTitle}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
