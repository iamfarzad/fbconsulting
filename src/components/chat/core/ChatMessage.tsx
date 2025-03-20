
import React from 'react';
import { AIMessage, MessageMedia } from '@/services/chat/messageTypes';
import { User, Bot, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatMessageProps {
  message: AIMessage;
  isLastMessage?: boolean;
  showFeedback?: boolean;
  onFeedback?: (id: string, rating: 'positive' | 'negative') => void;
  className?: string;
  variant?: 'default' | 'bubble' | 'minimal';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
  showFeedback = false,
  onFeedback,
  className = '',
  variant = 'default',
}) => {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';
  const isError = role === 'error';
  const isSystem = role === 'system';
  
  // Format timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  // Get appropriate icon based on role
  const Icon = isUser ? User : isError ? AlertCircle : Bot;
  
  // Handle feedback
  const handleFeedback = (rating: 'positive' | 'negative') => {
    if (onFeedback && message.id) {
      onFeedback(message.id, rating);
    }
  };

  // Function to render media items
  const renderMedia = (mediaItems: MessageMedia[]) => {
    return (
      <div className="flex flex-col gap-2 mt-2">
        {mediaItems.map((item, index) => {
          if (item.type === 'image' && (item.url || item.data)) {
            const imgSrc = item.url || item.data;
            return (
              <div key={index} className="rounded-md overflow-hidden border">
                <img 
                  src={imgSrc} 
                  alt={item.caption || 'Attached image'} 
                  className="w-full max-h-80 object-contain bg-neutral-100 dark:bg-neutral-900" 
                />
                {item.caption && (
                  <div className="p-2 text-sm text-muted-foreground bg-neutral-50 dark:bg-neutral-950">
                    {item.caption}
                  </div>
                )}
              </div>
            );
          } else if (item.type === 'code' && item.codeContent) {
            return (
              <div key={index} className="rounded-md overflow-hidden border bg-neutral-100 dark:bg-neutral-900 p-4 font-mono text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">{item.codeLanguage || 'Code'}</span>
                </div>
                <pre className="whitespace-pre-wrap break-words">
                  {item.codeContent}
                </pre>
              </div>
            );
          } else if (item.type === 'link' && item.url) {
            return (
              <a 
                key={index} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-md border bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.linkTitle || item.url}</div>
                  {item.linkDescription && (
                    <div className="text-sm text-muted-foreground mt-1">{item.linkDescription}</div>
                  )}
                </div>
                {item.linkImage && (
                  <div className="ml-3 h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.linkImage} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </a>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Different styling based on variant
  if (variant === 'bubble') {
    return (
      <div 
        className={cn(
          "flex items-start gap-3 group",
          isUser ? "flex-row-reverse" : "flex-row",
          className
        )}
      >
        <div 
          className={cn(
            "max-w-[80%] px-4 py-3 rounded-2xl",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
            isError && "bg-destructive/10 text-destructive"
          )}
        >
          {content}
          {message.mediaItems && message.mediaItems.length > 0 && renderMedia(message.mediaItems)}
          <div className={cn(
            "text-xs mt-1.5 opacity-70",
            isUser ? "text-right" : "text-left"
          )}>
            {formattedTime}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("py-3", className)}>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {isUser ? 'You' : isError ? 'Error' : 'AI Assistant'}
          </span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
        <div className="pl-6">
          <div className="whitespace-pre-wrap">{content}</div>
          {message.mediaItems && message.mediaItems.length > 0 && renderMedia(message.mediaItems)}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={cn(
        "flex items-start gap-3 group py-3",
        isUser ? "justify-end" : "",
        className
      )}
    >
      {!isUser && !isSystem && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      
      <div className={cn(
        "flex-1 relative",
        isUser ? "max-w-[80%] ml-12" : isSystem ? "max-w-full" : "max-w-[80%] mr-12",
      )}>
        <div className={cn(
          "p-3 rounded-lg relative",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : isSystem 
              ? "bg-muted/50 text-muted-foreground text-sm" 
              : isError 
                ? "bg-destructive/10 text-destructive"
                : "bg-muted rounded-tl-none"
        )}>
          <div className="whitespace-pre-wrap">{content}</div>
          {message.mediaItems && message.mediaItems.length > 0 && renderMedia(message.mediaItems)}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
          
          {showFeedback && !isUser && !isSystem && message.id && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleFeedback('positive')}
                    >
                      <ThumbsUp className={cn(
                        "h-3.5 w-3.5", 
                        message.feedback?.rating === 'positive' ? "text-green-500" : "text-muted-foreground"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleFeedback('negative')}
                    >
                      <ThumbsDown className={cn(
                        "h-3.5 w-3.5", 
                        message.feedback?.rating === 'negative' ? "text-red-500" : "text-muted-foreground"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as unhelpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};
