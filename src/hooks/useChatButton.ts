
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

export function useChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithChat') === 'true';
  });
  const location = useLocation();
  
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    
    // If this is the first time opening chat, go to full screen
    if (!hasInteracted) {
      setIsFullScreen(true);
      setHasInteracted(true);
      localStorage.setItem('hasInteractedWithChat', 'true');
    }
    
    // Track the chat toggle action
    trackEvent({
      action: isOpen ? 'chat_closed' : 'chat_opened',
      category: 'chatbot',
      label: 'chat_toggle',
      page: location.pathname,
    });
  }, [isOpen, hasInteracted, location.pathname]);
  
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
    
    // Track the fullscreen toggle
    trackEvent({
      action: isFullScreen ? 'chat_minimized' : 'chat_fullscreen',
      category: 'chatbot',
      label: 'fullscreen_toggle',
      page: location.pathname,
    });
  }, [isFullScreen, location.pathname]);
  
  // Check if we should show the chat button (hide on homepage)
  const shouldShowButton = location.pathname !== '/';
  
  return {
    isOpen,
    isFullScreen,
    toggleChat,
    toggleFullScreen,
    shouldShowButton,
    hasInteracted,
    setIsFullScreen
  };
}
