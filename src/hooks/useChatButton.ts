
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

export function useChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    
    // Track the chat toggle action
    trackEvent({
      action: isOpen ? 'chat_closed' : 'chat_opened',
      category: 'chatbot',
      label: 'chat_toggle',
      page: location.pathname,
    });
  }, [isOpen, location.pathname]);
  
  // Check if we should show the chat button (hide on homepage)
  const shouldShowButton = location.pathname !== '/';
  
  return {
    isOpen,
    toggleChat,
    shouldShowButton
  };
}
