import React from 'react';
import { Bot, X } from 'lucide-react';
import { AIChatInput } from './ui/ai-chat';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatButton } from '@/hooks/useChatButton';
import FullScreenChat from './chat/FullScreenChat';
import { AnimatedBars } from './ui/AnimatedBars';

const ChatButton = () => {
  const { 
    isOpen, 
    isFullScreen, 
    toggleChat, 
    toggleFullScreen, 
    shouldShowButton 
  } = useChatButton();
  
  if (!shouldShowButton) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence>
        {isOpen && !isFullScreen && (
          <motion.div
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 300, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-full max-w-md"
          >
            <div className="bg-black border border-white/30 rounded-xl shadow-lg p-4 dark:bg-black dark:border-white/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Bot size={18} className="text-white" />
                  Farzad's AI
                </h3>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block">
                    <AnimatedBars isActive={true} small={true} />
                  </div>
                  <button 
                    onClick={toggleChat}
                    className="text-white/70 hover:text-white p-1 rounded-full hover:bg-black/80"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              <AIChatInput placeholderText="Ask me anything about our AI services..." />
            </div>
          </motion.div>
        )}
        
        {isOpen && isFullScreen && (
          <FullScreenChat onMinimize={toggleFullScreen} />
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot size={24} />
        <span className="sr-only">Open AI Chat</span>
      </motion.button>
    </>
  );
};

export default ChatButton;
