
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const location = useLocation();
  
  // Reset chat state when route changes
  useEffect(() => {
    // Don't close chat on initial page load
    const handleRouteChange = () => {
      // Only close if not in fullscreen mode
      if (!isFullScreen) {
        setIsOpen(false);
      }
    };
    
    // Add a cleanup function only on subsequent renders
    return () => {
      handleRouteChange();
    };
  }, [location.pathname, isFullScreen]);
  
  // Determine if we should show the chat button
  // For example, don't show on pages that already have a chat interface
  const shouldShowButton = () => {
    // Don't show on paths that have their own chat
    const excludePaths = ['/chat', '/support'];
    return !excludePaths.some(path => location.pathname.startsWith(path));
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };
  
  return {
    isOpen,
    setIsOpen,
    isFullScreen,
    setIsFullScreen,
    toggleChat,
    toggleFullScreen,
    shouldShowButton: shouldShowButton()
  };
};
