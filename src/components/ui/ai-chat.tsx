
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatInput } from "./ai-chat/ChatInput";
import { ChatMessageList } from "./ai-chat/ChatMessageList";
import { useMessages } from "@/hooks/useMessages";
import { useSuggestedResponse } from "@/hooks/useSuggestedResponse";
import { LeadInfo } from "@/services/lead/leadExtractor";
import { generateResponse } from "@/services/chat/responseGenerator";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import FullScreenChat from "../chat/FullScreenChat";
import { useMobile } from "@/hooks/use-mobile";

interface AIChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
}

export function AIChatInput({ 
  placeholderText = "Ask me anything...",
  autoFullScreen = false 
}: AIChatInputProps) {
  const [showMessages, setShowMessages] = useState(false);
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useMobile();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Create a mock LeadInfo object for suggestions with correct type structure
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery' // Using a valid property from LeadInfo
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  const [inputValue, setInputValue] = useState("");

  // Calculate container height based on content
  const calculateContainerHeight = () => {
    if (containerRef.current) {
      // Update max-height based on viewport if needed
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600); // 70% of viewport height or 600px, whichever is smaller
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  // Update container height on window resize
  useEffect(() => {
    calculateContainerHeight();
    window.addEventListener('resize', calculateContainerHeight);
    return () => window.removeEventListener('resize', calculateContainerHeight);
  }, []);

  // Extract current page from path
  const getCurrentPage = (): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1); // Remove leading slash
  };

  // Automatically go fullscreen when first message is entered on mobile if autoFullScreen is true
  useEffect(() => {
    if (autoFullScreen && isMobile && messages.length > 0 && !isFullScreen) {
      setIsFullScreen(true);
    }
  }, [messages.length, isMobile, autoFullScreen, isFullScreen]);

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
    
    // Show messages container when first message is sent
    if (!showMessages) {
      setShowMessages(true);
    }
  };

  const handleClear = () => {
    clearMessages();
    setShowMessages(false);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  // If in fullscreen mode, show FullScreenChat
  if (isFullScreen) {
    return (
      <FullScreenChat 
        onMinimize={toggleFullScreen} 
        initialMessages={messages}
        onSendMessage={handleSend}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        suggestedResponse={suggestedResponse}
        onClear={handleClear}
        placeholderText={placeholderText}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        ref={containerRef}
        className="flex flex-col w-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Messages Container with fixed height and scroll */}
        <AnimatePresence mode="wait">
          {(showMessages || messages.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: "auto",
                transition: {
                  height: { type: "spring", damping: 15, stiffness: 300 },
                  opacity: { duration: 0.3 }
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: {
                  height: { duration: 0.3 },
                  opacity: { duration: 0.2 }
                }
              }}
              className="will-change-scroll mb-4"
            >
              <ChatMessageList 
                messages={messages} 
                showMessages={showMessages} 
              />
              
              {/* Expand to fullscreen button */}
              {messages.length > 0 && (
                <div className="p-2 text-center">
                  <button
                    onClick={toggleFullScreen}
                    className="text-black/70 text-sm hover:text-black transition-colors"
                  >
                    Expand to full screen
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Container with shadow transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.2 }
          }}
          className="relative z-10 bg-background"
        >
          <ChatInput
            value={inputValue}
            setValue={setInputValue}
            onSend={handleSend}
            onClear={handleClear}
            isLoading={isLoading}
            showMessages={showMessages}
            hasMessages={messages.length > 0}
            suggestedResponse={suggestedResponse}
            placeholder={placeholderText}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIChatInput;
