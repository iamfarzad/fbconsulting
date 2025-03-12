
import { useState, useEffect } from "react";
import { useAIChatInput } from "./useAIChatInput";
import { useLocation } from "react-router-dom";

export function useChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const location = useLocation();
  
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    suggestedResponse,
    handleSend,
    handleClear,
  } = useAIChatInput();

  // Reset states when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsFullScreen(false);
  }, [location.pathname]);

  const toggleChat = () => {
    if (isFullScreen) {
      // First minimize, then close after animation
      setIsFullScreen(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(prev => !prev);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  // Don't show button on routes with embedded chat
  const shouldShowButton = !location.pathname.includes('/chat');

  return {
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
  };
}
