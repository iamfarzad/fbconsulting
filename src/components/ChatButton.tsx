
import React from 'react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedChat } from '@/components/chat/UnifiedChat';
import UnifiedFullScreenChat from '@/components/chat/UnifiedFullScreenChat';
import { useToast } from '@/hooks/use-toast';

const ChatButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const { toast } = useToast();
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isFullScreen && !isOpen) {
      setIsFullScreen(false);
    }
  };
  
  const toggleFullScreen = () => {
    console.log('Toggle fullscreen clicked. Current state:', isFullScreen);
    setIsFullScreen(!isFullScreen);
  };
  
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
              title="AI Assistant"
              subtitle="How can I help you today?"
              onToggleFullScreen={toggleFullScreen}
              placeholder="Ask me anything about our AI services..."
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
