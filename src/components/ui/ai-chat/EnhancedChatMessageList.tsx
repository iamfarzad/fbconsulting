
import React, { useRef, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';
import { EnhancedChatMessage } from './EnhancedChatMessage';

interface EnhancedChatMessageListProps {
  messages: AIMessage[];
  isLoading?: boolean;
  className?: string;
}

export const EnhancedChatMessageList: React.FC<EnhancedChatMessageListProps> = ({
  messages,
  isLoading = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  if (messages.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-4 text-center", className)}>
        <p className="text-muted-foreground">
          No messages yet. Start a conversation!
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col space-y-4 p-4", className)}>
      {messages.map((message, index) => (
        <EnhancedChatMessage
          key={message.id || `message-${index}`}
          message={message}
          isLoading={index === messages.length - 1 && isLoading && message.role === 'assistant'}
        />
      ))}
      
      {/* Loading message */}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <EnhancedChatMessage
          message={{
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
            isProcessing: true
          }}
          isLoading={true}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
