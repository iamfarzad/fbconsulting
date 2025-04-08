
import React from 'react';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/services/chat/messageTypes';
import { MessageMedia } from './MessageMedia';
import { TypingIndicator } from './TypingIndicator';

interface EnhancedChatMessageProps {
  message: AIMessage;
  isTyping?: boolean;
  className?: string;
}

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
