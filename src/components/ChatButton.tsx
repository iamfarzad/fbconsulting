
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
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md">
              <div className="relative w-full h-full max-w-7xl mx-auto px-4">
                <div className="flex justify-end p-4">
                  <button 
                    onClick={toggleChat}
                    className="text-white/70 hover:text-white p-1 rounded-full hover:bg-black/80"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="h-full pt-20 pb-10">
                  <div className="bg-transparent h-full max-w-4xl mx-auto overflow-hidden flex flex-col">
                    <div className="p-6 text-center mb-4">
                      <h2 className="text-2xl font-semibold text-white mb-2">Chat with AI Assistant</h2>
                      <div className="flex justify-center">
                        <AnimatedBars isActive={true} />
                      </div>
                      <p className="text-white/70 mt-4">
                        Ask me anything about our AI services and automation solutions
                      </p>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-hidden">
                      <AIChatInput />
                    </div>
                  </div>
                </div>
              </div>
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
