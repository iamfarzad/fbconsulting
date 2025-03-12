
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';
import { useMessages } from './useMessages';
import { useSuggestedResponse } from './useSuggestedResponse';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { generateResponse } from '@/services/chat/responseGenerator';
import { useToast } from './use-toast';

export function useChatButton() {
  // Chat visibility state
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('hasInteractedWithChat') === 'true';
  });
  
  // Input state and loading state
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const location = useLocation();
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const { toast } = useToast();
  
  // Create a mock LeadInfo object for suggestions
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery'
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  
  // Toggle chat open/closed
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    
    // If this is the first time opening chat, go to full screen
    if (!hasInteracted) {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsFullScreen(true);
      }, 100);
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
  
  // Toggle fullscreen mode
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
  
  // Extract current page from path
  const getCurrentPage = useCallback((): string | undefined => {
    if (location.pathname === '/') return 'home';
    return location.pathname.substring(1); // Remove leading slash
  }, [location.pathname]);
  
  // Send a message
  const handleSend = useCallback(async () => {
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
      console.error("Chat button error:", error);
    } finally {
      setIsLoading(false);
    }
    
    setInputValue("");
  }, [inputValue, addUserMessage, addAssistantMessage, messages, toast, getCurrentPage]);

  // Handle clearing chat
  const handleClear = useCallback(() => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  }, [clearMessages, toast]);
  
  // Always go to full screen after first message with a small delay
  useEffect(() => {
    if (messages.length > 0 && isOpen && !isFullScreen) {
      const timer = setTimeout(() => {
        toggleFullScreen();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, isOpen, isFullScreen, toggleFullScreen]);
  
  // Check if we should show the chat button (hide on homepage)
  const shouldShowButton = location.pathname !== '/';
  
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
    shouldShowButton,
    hasInteracted,
    setIsFullScreen
  };
}
