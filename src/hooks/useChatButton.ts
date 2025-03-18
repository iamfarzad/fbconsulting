import { useState, useEffect } from "react";
import { useUnifiedChat } from "./useUnifiedChat";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  // Wrap useUnifiedChat in try-catch to handle potential errors
  let chatState;
  try {
    chatState = useUnifiedChat({ useCopilotKit: true });
  } catch (err) {
    console.error('Error in useUnifiedChat:', err);
    setError(err instanceof Error ? err : new Error('Unknown error in chat'));
    
    // Return default/fallback values
    return {
      isOpen,
      isFullScreen,
      inputValue: '',
      setInputValue: () => {},
      isLoading: false,
      messages: [],
      suggestedResponse: null,
      toggleChat: () => {
        toast({
          title: 'Chat is currently unavailable',
          description: 'Please try again later',
          variant: 'destructive'
        });
      },
      toggleFullScreen: () => {},
      handleSend: () => Promise.resolve(),
      handleClear: () => {},
      shouldShowButton: !location.pathname.includes('/chat'),
      chatService: null,
      error
    };
  }
  
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    suggestedResponse,
    handleSend,
    handleClear,
    setIsFullScreen: setAIChatFullScreen,
    chatService
  } = chatState;

  // Keep both isFullScreen states synchronized
  useEffect(() => {
    setAIChatFullScreen(isFullScreen);
  }, [isFullScreen, setAIChatFullScreen]);

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
    messages: messages.filter(msg => msg.role !== 'system'),
    suggestedResponse,
    toggleChat,
    toggleFullScreen,
    handleSend,
    handleClear,
    shouldShowButton,
    chatService,
    error
  };
}
