
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/services/chat/types';
import { Bot, User, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GraphicCardCollection } from '@/components/ui/ai-chat/GraphicCardCollection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatMessageProps {
  message: AIMessage;
  isLastMessage?: boolean;
  showTimestamp?: boolean;
  enableFeedback?: boolean;
  onFeedback?: (messageId: string | undefined, feedback: 'positive' | 'negative', comment?: string) => void;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastMessage = false,
  showTimestamp = false,
  enableFeedback = false,
  onFeedback,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(
    message.feedback?.rating || null
  );
  
  // Format timestamp if needed
  const timestamp = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  
  // Handle message content
  const content = message.content;
  let processedContent = content;
  
  // Extract cards if they exist
  const hasCards = content.includes('|||CARD_START|||') && content.includes('|||CARD_END|||');
  const cards = hasCards
    ? content.match(/\|\|\|CARD_START\|\|\|(.*?)\|\|\|CARD_END\|\|\|/gs)?.map(match => {
        const cardContent = match.replace(/\|\|\|CARD_START\|\|\||\|\|\|CARD_END\|\|\|/g, '');
        try {
          return JSON.parse(cardContent);
        } catch {
          return null;
        }
      }).filter(Boolean) || []
    : [];
  
  // Clean the message text if cards exist
  if (hasCards) {
    processedContent = content.replace(/\|\|\|CARD_START\|\|\|.*?\|\|\|CARD_END\|\|\|/gs, '').trim();
  }
  
  // Handle different message roles
  const isUser = message.role === 'user';
  const isError = message.role === 'error';
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const handleFeedback = (rating: 'positive' | 'negative') => {
    if (onFeedback && message.id) {
      onFeedback(message.id, rating);
      setFeedbackGiven(rating);
    }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div 
        className={cn(
          'flex gap-3 max-w-[85%]',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Avatar */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : isError
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-muted'
        )}>
          {isUser ? (
            <User size={16} />
          ) : isError ? (
            <AlertCircle size={16} />
          ) : (
            <Bot size={16} />
          )}
        </div>
        
        {/* Message content */}
        <div className="flex flex-col gap-2">
          {/* Main message bubble */}
          <div 
            className={cn(
              'px-4 py-3 rounded-lg',
              isUser 
                ? 'bg-primary text-primary-foreground' 
                : isError
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-muted text-foreground'
            )}
          >
            {processedContent && (
              <div className="whitespace-pre-wrap">{processedContent}</div>
            )}
            
            {/* Media attachments will go here */}
            {message.mediaItems && message.mediaItems.length > 0 && (
              <div className="mt-2 space-y-2">
                {/* Implement media rendering here */}
              </div>
            )}
            
            {/* Show timestamp if needed */}
            {showTimestamp && timestamp && (
              <div className="mt-1 text-xs opacity-60 text-right">
                {timestamp}
              </div>
            )}
          </div>
          
          {/* Cards collection if any */}
          {cards.length > 0 && (
            <div className="mt-2">
              <GraphicCardCollection cards={cards} />
            </div>
          )}
          
          {/* Feedback controls */}
          {!isUser && enableFeedback && onFeedback && (
            <div className="flex items-center justify-end gap-2 mt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-6 w-6',
                        feedbackGiven === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                      )}
                      onClick={() => handleFeedback('positive')}
                    >
                      <ThumbsUp size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-6 w-6',
                        feedbackGiven === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                      )}
                      onClick={() => handleFeedback('negative')}
                    >
                      <ThumbsDown size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Not helpful</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
