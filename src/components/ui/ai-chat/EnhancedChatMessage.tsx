
import React from 'react';
import { cn } from '@/lib/utils';
import { AIMessage, MessageMedia } from '@/services/chat/messageTypes';
import { TypingIndicator } from './TypingIndicator';

interface EnhancedChatMessageProps {
  message: AIMessage;
  isTyping?: boolean;
  className?: string;
}

// Simple component to render message media
const MessageMedia: React.FC<{ media: MessageMedia[], className?: string }> = ({ media, className }) => {
  if (!media || media.length === 0) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {media.map((item, index) => (
        <div key={index} className="border rounded-md p-2 bg-background/50">
          {item.type === 'image' && item.url && (
            <img src={item.url} alt={item.caption || "Image"} className="max-h-40 rounded" />
          )}
          {item.type === 'document' && (
            <div className="flex items-center gap-2">
              <span>{item.fileName || "Document"}</span>
            </div>
          )}
          {item.caption && <p className="text-xs text-muted-foreground mt-1">{item.caption}</p>}
        </div>
      ))}
    </div>
  );
};

export const EnhancedChatMessage: React.FC<EnhancedChatMessageProps> = ({
  message,
  isTyping = false,
  className
}) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={cn(
        "flex mb-4 max-w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div 
        className={cn(
          "px-4 py-3 rounded-lg max-w-[80%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div className="prose dark:prose-invert">
          {message.content}
        </div>
        
        {isTyping && message.role === 'assistant' && (
          <TypingIndicator className="mt-2" />
        )}
        
        {message.mediaItems && message.mediaItems.length > 0 && (
          <MessageMedia media={message.mediaItems} className="mt-2" />
        )}
      </div>
    </div>
  );
};

export default EnhancedChatMessage;
