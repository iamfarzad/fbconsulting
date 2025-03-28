
import React, { useState } from 'react';
import { Bot, User, ThumbsUp, ThumbsDown, MoreHorizontal, Copy, AlertCircle } from 'lucide-react';
import { AIMessage } from '@/services/chat/messageTypes';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AIMessage;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative' | null) => void;
  isLatestMessage?: boolean;
  showFeedback?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFeedback,
  isLatestMessage = false,
  showFeedback = true
}) => {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  const isSystem = message.role === 'system';
  const messageId = message.id || String(message.timestamp);
  
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };
  
  const handleFeedback = (feedback: 'positive' | 'negative') => {
    if (onFeedback && messageId) {
      // Toggle feedback if already selected
      const newFeedback = message.feedback === feedback ? null : feedback;
      onFeedback(messageId, newFeedback);
    }
  };

  if (isSystem) return null;  // Don't render system messages
  
  return (
    <div 
      className={cn(
        "flex w-full items-start gap-2 py-2",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for AI */}
      {!isUser && !isError && (
        <div className="flex-shrink-0 rounded-full p-1.5 bg-primary/10 w-8 h-8 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      {/* Message content */}
      <div 
        className={cn(
          "rounded-lg px-4 py-2.5 max-w-[80%] relative",
          isUser 
            ? "bg-primary text-primary-foreground"
            : isError 
              ? "bg-destructive/10 text-destructive border border-destructive/20" 
              : "bg-muted"
        )}
      >
        {/* Error icon for error messages */}
        {isError && (
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="font-semibold text-destructive">Error</span>
          </div>
        )}
        
        {/* Message text */}
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Actions row */}
        {showActions && !isUser && !isError && showFeedback && (
          <div className="absolute -bottom-9 right-0 flex items-center gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
            {/* Copy button */}
            <button 
              onClick={handleCopyMessage}
              className="text-muted-foreground hover:text-foreground p-1 rounded"
              aria-label="Copy message"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            {/* Feedback buttons */}
            <button 
              onClick={() => handleFeedback('positive')}
              className={cn(
                "text-muted-foreground hover:text-foreground p-1 rounded",
                message.feedback === 'positive' && "text-green-500 hover:text-green-600"
              )}
              aria-label="Helpful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => handleFeedback('negative')}
              className={cn(
                "text-muted-foreground hover:text-foreground p-1 rounded",
                message.feedback === 'negative' && "text-red-500 hover:text-red-600"
              )}
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 rounded-full p-1.5 bg-muted w-8 h-8 flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
