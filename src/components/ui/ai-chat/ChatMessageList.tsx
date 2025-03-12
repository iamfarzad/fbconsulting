
import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { AIMessage } from "@/services/copilotService";
import { ChatMessage } from "./ChatMessage";

interface ChatMessageListProps {
  messages: AIMessage[];
  showMessages: boolean;
  isFullScreen?: boolean; // Already had this prop
}

export const ChatMessageList = ({ 
  messages, 
  showMessages, 
  isFullScreen = false
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Improved scroll behavior with guaranteed scroll-to-bottom
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current && !isFullScreen) { // Don't scroll if in full screen
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior, 
          block: "end" 
        });
      }, 10);
    }
  };
  
  // Scroll to bottom when messages change - only if not in full screen
  useEffect(() => {
    if (messages.length > 0 && !isFullScreen) {
      // Immediate scroll for better UX to avoid content jumping
      scrollToBottom("auto");
      
      // Then smooth scroll after a small delay for animation purposes
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [messages, isFullScreen]);
  
  // Scroll when visibility changes - only if not in full screen
  useEffect(() => {
    if (showMessages && !isFullScreen) {
      // Allow animation to complete before scrolling
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showMessages, isFullScreen]);

  if (!showMessages && messages.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`${isFullScreen ? 'bg-transparent' : 'bg-black/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg'} p-4 overflow-y-auto overscroll-contain`}
      style={{
        height: messages.length > 0 ? 'auto' : '200px',
        minHeight: '120px',
        maxHeight: isFullScreen ? '100%' : '400px', // Allow full height in full screen mode
        scrollbarGutter: 'stable',
        scrollBehavior: 'smooth',
        position: 'relative', // Added explicit position
        overflowY: isFullScreen ? 'visible' : 'auto' // Disable scrolling in full screen mode
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
                isLastMessage={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
