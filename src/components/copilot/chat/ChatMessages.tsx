import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../../types/chat';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Ensure messages is always treated as an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="w-full space-y-4">
      {safeMessages.map((message, index) => {
        const isUser = message.role === 'user';
        const timestamp = message.timestamp 
          ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
          : '';
        
        return (
          <div 
            key={index}
            className={cn(
              'flex w-full max-w-[80%] gap-3',
              isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
            )}
          >
            <Avatar 
              className={cn(
                'h-8 w-8',
                isUser ? 'bg-primary' : 'bg-secondary'
              )}
            >
              <span className="text-xs font-medium">
                {isUser ? 'U' : 'AI'}
              </span>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className={cn(
                'rounded-lg p-3',
                isUser ? 'bg-primary/10' : 'bg-muted'
              )}>
                {isUser ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              <span 
                className={cn(
                  'text-xs text-muted-foreground',
                  isUser ? 'text-right' : 'text-left'
                )}
              >
                {timestamp}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
