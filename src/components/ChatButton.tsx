
import { useState } from 'react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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
