
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export function useChatUI() {
  const [inputValue, setInputValue] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMessages, setShowMessages] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // Calculate container height based on content
  const calculateContainerHeight = useCallback(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600);
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  }, []);

  // Update container height on window resize
  useEffect(() => {
    calculateContainerHeight();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, [calculateContainerHeight]);

  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  // Extract current page from path
  const getCurrentPage = useCallback((): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1); // Remove leading slash
  }, [currentPath]);

  return {
    inputValue,
    setInputValue,
    isFullScreen,
    setIsFullScreen,
    showMessages,
    setShowMessages,
    containerRef,
    toggleFullScreen,
    getCurrentPage
  };
}
