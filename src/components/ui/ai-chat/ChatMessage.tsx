
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { MessageMedia } from '@/services/chat/messageTypes';
import { MessageMedia as MessageMediaComponent } from './MessageMedia';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  isLoading?: boolean;
  avatarUrl?: string;
  userName?: string;
  timestamp?: number;
  isError?: boolean;
  media?: MessageMedia[];
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  isLoading = false,
  avatarUrl,
  userName,
  timestamp,
  isError = false,
  media = [],
  className,
}) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';
  const isSystem = role === 'system';
  
  // Format timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  return (
    <div 
      className={cn(
        "flex gap-3 p-4",
        isUser ? "justify-end" : "justify-start",
        isError && "opacity-75",
        className
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 rounded-full">
          <img 
            src={avatarUrl || "/avatar-ai.png"} 
            alt={userName || "AI"} 
            className="rounded-full object-cover" 
          />
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          isSystem && "bg-muted text-muted-foreground text-sm italic",
          isError && "bg-destructive/10 text-destructive dark:bg-destructive/20"
        )}>
          {/* Message content */}
          {content}
          
          {/* Loading indicator */}
          {isLoading && (
            <span className="inline-block ml-1">
              <span className="animate-ping">.</span>
              <span className="animate-ping animation-delay-200">.</span>
              <span className="animate-ping animation-delay-400">.</span>
            </span>
          )}
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <div className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </div>
        )}
        
        {/* Media content */}
        {media && media.length > 0 && (
          <MessageMediaComponent media={media} className="mt-2" />
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-full">
          <img 
            src={avatarUrl || "/avatar-user.png"} 
            alt={userName || "You"} 
            className="rounded-full object-cover" 
          />
        </Avatar>
      )}
    </div>
  );
};
