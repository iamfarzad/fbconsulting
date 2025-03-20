
import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { AIMessage } from "@/services/chat/messageTypes";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageProps {
  message: AIMessage;
  isLastMessage?: boolean;
}

// Simple ChatMessage component for this file
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        {message.content}
      </div>
    </div>
  );
};

interface ChatMessageListProps {
  messages: AIMessage[];
  showMessages: boolean;
  isFullScreen?: boolean;
  isLoading?: boolean;
}

export const ChatMessageList = ({ 
  messages, 
  showMessages, 
  isFullScreen = false,
  isLoading = false
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior, 
        block: "end" 
      });
    }
  };
  
  // Scroll on new messages or loading state change
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      scrollToBottom("smooth");
    }
  }, [messages, isLoading]);
  
  // Initial scroll and visibility change scroll
  useEffect(() => {
    if (showMessages) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMessages]);

  if (!showMessages && messages.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`${isFullScreen ? 'bg-transparent' : 'bg-black/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg'} p-4`}
      style={{
        height: messages.length > 0 ? 'auto' : '200px',
        minHeight: '120px',
        maxHeight: isFullScreen ? '100%' : '400px',
        scrollbarGutter: 'stable',
        scrollBehavior: 'smooth',
        position: 'relative',
        overflowY: isFullScreen ? 'auto' : 'auto'
      }}
    >
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-10"
          >
            <Bot size={40} className="text-white/90 mb-4" />
            <h3 className="text-white/90 text-lg font-medium mb-2">
              How can I help with your AI automation needs?
            </h3>
            <p className="text-white/70 max-w-lg">
              Ask me anything about implementing AI in your business, from chatbots to 
              workflow automation and strategic planning.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg} 
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
