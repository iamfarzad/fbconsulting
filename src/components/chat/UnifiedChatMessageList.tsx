import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { AIMessage } from '@/services/chat/types';

export const UnifiedChatMessageList = () => {
  const { state } = useChat();
  const { messages, isLoading } = state;

  if (!Array.isArray(messages)) {
    return (
      <div className="text-center text-red-500">
        Invalid messages format. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message: AIMessage, index) => {
        const isUser = message.role === 'user';
        const isLastMessage = index === messages.length - 1;
        
        return (
          <div
            key={message.id || `${message.role}-${index}`}
            className={cn(
              'flex w-full',
              isUser ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={cn(
              'flex items-start gap-2 max-w-[80%]',
              isUser ? 'flex-row-reverse' : 'flex-row'
            )}>
              <Avatar
                src={isUser ? '/placeholder.svg' : '/f_b_logo.glb'}
                fallback={isUser ? 'U' : 'AI'}
                className="w-8 h-8"
              />
              <div className={cn(
                'rounded-lg px-4 py-2 text-sm',
                isUser 
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50',
                isLastMessage && !isUser && isLoading && 'animate-pulse'
              )}>
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
