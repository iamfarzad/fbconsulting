
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to manage the chat UI state
 */
export function useChatUIState() {
  const [showMessages, setShowMessages] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // Calculate the container height for proper display
  const calculateContainerHeight = () => {
    if (containerRef.current && typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600);
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  // Set up resize listener
  useEffect(() => {
    calculateContainerHeight();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, []);

  // Toggle full screen mode
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  // Get the current page for context
  const getCurrentPage = (): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1);
  };

  return {
    showMessages,
    setShowMessages,
    isFullScreen,
    setIsFullScreen,
    containerRef,
    toggleFullScreen,
    getCurrentPage
  };
}
