
import React from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { AIChatInput } from './ui/ai-chat';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatButton } from '@/hooks/useChatButton';
import { useNavigate } from 'react-router-dom';

const ChatButton = () => {
  const { isOpen, toggleChat, shouldShowButton } = useChatButton();
  const navigate = useNavigate();
  
  // Hide on the home page since we already have the chat there
  if (!shouldShowButton) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 300, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-full max-w-md"
          >
            <div className="bg-deep-purple border border-teal/30 rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-neon-white font-medium flex items-center gap-2">
                  <Bot size={18} className="text-teal" />
                  AI Assistant
                </h3>
                <button 
                  onClick={toggleChat}
                  className="text-neon-white/70 hover:text-neon-white p-1 rounded-full hover:bg-deep-purple/80"
                >
                  <X size={18} />
                </button>
              </div>
              
              <AIChatInput placeholderText="Ask me anything about our AI services..." />
              
              <div className="mt-3 text-xs text-center">
                <button
                  onClick={() => {
                    toggleChat();
                    navigate('/animated-chat');
                  }}
                  className="text-teal hover:text-teal/80 flex items-center justify-center gap-1 mx-auto"
                >
                  <Sparkles size={12} />
                  Try our animated chat experience
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 bg-teal text-deep-purple rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot size={24} />
      </motion.button>
    </>
  );
};

export default ChatButton;
