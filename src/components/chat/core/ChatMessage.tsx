
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Bot, User } from 'lucide-react';
import { AIMessage } from '@/services/chat/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AIMessage;
  isLastMessage?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
  className,
}) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  const isSystem = message.role === 'system';
  
  return (
    <motion.div
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
          {isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : isError
              ? "bg-destructive text-destructive-foreground"
              : isSystem
                ? "bg-muted/50 text-muted-foreground italic"
                : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        
        {message.timestamp && (
          <div className="mt-1 text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};
