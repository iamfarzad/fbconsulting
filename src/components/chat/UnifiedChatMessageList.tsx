
import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { ChatMessage } from './core/ChatMessage';
import { TypingIndicator } from './core/TypingIndicator';

interface UnifiedChatMessageListProps {
  showEmptyState?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  className?: string;
}

export const UnifiedChatMessageList: React.FC<UnifiedChatMessageListProps> = ({
  showEmptyState = true,
  emptyStateTitle = 'How can I help you today?',
  emptyStateDescription = 'Ask me anything about AI automation, workflow optimization, or customized solutions for your business.',
  className
}) => {
  const { state } = useChat();
  const { messages, isLoading, showMessages } = state;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive or when loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Don't render anything if there are no messages and showMessages is false
  if (!showMessages && messages.length === 0) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`bg-black/95 dark:bg-black/95 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-white/20 shadow-lg p-4 ${className}`}
      style={{
        minHeight: '120px',
        maxHeight: '400px',
        overflowY: 'auto',
        scrollBehavior: 'smooth'
      }}
    >
      <AnimatePresence>
        {messages.length === 0 && showEmptyState ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-10"
          >
            <Bot size={40} className="text-white/90 mb-4" />
            <h3 className="text-white/90 text-lg font-medium mb-2">
              {emptyStateTitle}
            </h3>
            <p className="text-white/70 max-w-lg">
              {emptyStateDescription}
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg} 
                isLastMessage={index === messages.length - 1}
              />
            ))}
            
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
