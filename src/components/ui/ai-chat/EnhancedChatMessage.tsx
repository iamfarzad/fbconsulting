
import React from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { MessageMedia } from './MessageMedia';
import { TypingIndicator } from './TypingIndicator';
import { User, Bot } from 'lucide-react';

interface EnhancedChatMessageProps {
  message: AIMessage;
  isUser?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const EnhancedChatMessage: React.FC<EnhancedChatMessageProps> = ({
  message,
  isUser = message.role === 'user',
  isLoading = message.isProcessing,
  className,
}) => {
  const isError = message.role === 'error';
  const hasMedia = message.mediaItems && message.mediaItems.length > 0;
  
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      {!isUser && (
        <div className="mr-2 flex-shrink-0 mt-1">
          <Avatar className="w-8 h-8 border">
            <Bot className="h-4 w-4" />
          </Avatar>
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[85%] rounded-lg p-3 space-y-2",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : isError
              ? "bg-destructive/10 text-destructive rounded-tl-none"
              : "bg-muted text-foreground rounded-tl-none"
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
          {isLoading && <TypingIndicator />}
        </div>
        
        {/* Media items if any */}
        {hasMedia && (
          <MessageMedia media={message.mediaItems} />
        )}
        
        {/* Message metadata (e.g. timestamp) */}
        {message.timestamp && (
          <div className="text-xs opacity-70 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="ml-2 flex-shrink-0 mt-1">
          <Avatar className="w-8 h-8 border">
            <User className="h-4 w-4" />
          </Avatar>
        </div>
      )}
    </div>
  );
};
