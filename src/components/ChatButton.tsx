
import React from 'react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FullScreenChat from './chat/FullScreenChat';
import { useChatButton } from '@/hooks/useChatButton';
import { useMessages } from '@/hooks/useMessages';
import { useSuggestedResponse } from '@/hooks/useSuggestedResponse';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { useToast } from '@/hooks/use-toast';
import { generateResponse } from '@/services/chat/responseGenerator';
import { useLocation } from 'react-router-dom';
import MiniChatWindow from './chat/MiniChatWindow';

const ChatButton = () => {
  // Use the chat button visibility hook
  const { 
    isOpen, 
    isFullScreen, 
    toggleChat, 
    toggleFullScreen, 
    shouldShowButton 
  } = useChatButton();
  
  // Message handling
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  // Create a mock LeadInfo object for suggestions
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery'
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  
  // Extract current page from path
  const getCurrentPage = (): string | undefined => {
    if (location.pathname === '/') return 'home';
    return location.pathname.substring(1); // Remove leading slash
  };
  
  const handleSend = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Message is empty",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      addUserMessage(inputValue);
      
      // Create mock lead info from conversation context
      const mockLeadInfo: LeadInfo = {
        interests: [...messages.map(m => m.content), inputValue],
        stage: 'discovery'
      };
      
      // Generate AI response with possible graphic cards
      const currentPage = getCurrentPage();
      const aiResponse = generateResponse(inputValue, mockLeadInfo);
      
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the response to the chat
      addAssistantMessage(aiResponse);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    
    setInputValue("");
  };

  const handleClear = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };
  
  if (!shouldShowButton) {
    return null;
  }
  
  // Always go to full screen after first message
  React.useEffect(() => {
    if (messages.length > 0 && isOpen && !isFullScreen) {
      toggleFullScreen();
    }
  }, [messages.length, isOpen, isFullScreen, toggleFullScreen]);
  
  return (
    <>
      <AnimatePresence>
        {isOpen && !isFullScreen && (
          <MiniChatWindow 
            onClose={toggleChat}
            onExpand={toggleFullScreen}
          />
        )}
        
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
