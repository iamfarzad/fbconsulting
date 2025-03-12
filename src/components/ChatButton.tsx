
import React from 'react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FullScreenChat from './chat/FullScreenChat';
import { useChatButton } from '@/hooks/useChatButton';
import MiniChatWindow from './chat/MiniChatWindow';

const ChatButton = () => {
  // Use our enhanced chat button hook for all functionality
  const { 
    isOpen, 
    isFullScreen, 
    inputValue,
    setInputValue,
    isLoading,
    messages,
    suggestedResponse,
    toggleChat,
    toggleFullScreen,
    handleSend,
    handleClear,
    shouldShowButton 
  } = useChatButton();
  
  if (!shouldShowButton) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && !isFullScreen && (
          <MiniChatWindow 
            onClose={toggleChat}
            onExpand={toggleFullScreen}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {isOpen && isFullScreen && (
          <FullScreenChat 
            onMinimize={toggleFullScreen}
            initialMessages={messages}
            onSendMessage={handleSend}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            suggestedResponse={suggestedResponse}
            onClear={handleClear}
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
