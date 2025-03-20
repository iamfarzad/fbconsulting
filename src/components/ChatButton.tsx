
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedFullScreenChat } from './chat/UnifiedFullScreenChat';
import { useChatButton } from '@/hooks/useChatButton';
import { UnifiedChat } from './chat/UnifiedChat';
import { useToast } from '@/hooks/use-toast';

const ChatButton = () => {
  // Use our enhanced chat button hook for all functionality
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Wrap the hook in a try-catch to handle potential errors
  let chatButtonState;
  try {
    chatButtonState = useChatButton();
  } catch (err) {
    console.error('Error in useChatButton hook:', err);
    // Return a minimal UI that won't crash
    return (
      <motion.button
        onClick={() => toast({ title: 'Chat is currently unavailable', description: 'Please try again later' })}
        className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center shadow-lg"
      >
        <Bot size={24} />
        <span className="sr-only">Chat Unavailable</span>
      </motion.button>
    );
  }
  
  const { 
    isOpen, 
    isFullScreen, 
    toggleChat,
    toggleFullScreen,
    shouldShowButton 
  } = chatButtonState;
  
  if (!shouldShowButton) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && !isFullScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-80 md:w-96 h-96"
          >
            <UnifiedChat
              fullScreen={false}
              onToggleFullScreen={toggleFullScreen}
              placeholderText="Ask me anything about our AI services..."
              className="h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {isOpen && isFullScreen && (
          <UnifiedFullScreenChat 
            onMinimize={toggleFullScreen}
            placeholderText="Ask me anything about our AI services..."
          />
        )}
      </AnimatePresence>
      
      {/* Only show the button if not in fullscreen */}
      {!isFullScreen && (
        <motion.button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 md:right-6 z-50 w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot size={24} />
          <span className="sr-only">Open AI Chat</span>
        </motion.button>
      )}
    </>
  );
};

export default ChatButton;
