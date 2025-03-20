
import React from 'react';
import { motion } from 'framer-motion';
import { AIMessage } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AIMessage;
  isLastMessage?: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
  className
}) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  
  return (
    <motion.div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "max-w-[80%] p-3 rounded-lg",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : isError
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.timestamp && (
          <div className="mt-1 text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
