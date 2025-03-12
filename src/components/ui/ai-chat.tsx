
"use client";

import React, { useEffect } from "react";
import { useAIChatInput } from "@/hooks/useAIChatInput";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import FullScreenChat from "../chat/FullScreenChat";
import { ChatContainer } from "./ai-chat/ChatContainer";

interface AIChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
}

export function AIChatInput({ 
  placeholderText = "Ask me anything...",
  autoFullScreen = false 
}: AIChatInputProps) {
  const {
    showMessages,
    messages,
    isLoading,
    inputValue,
    setInputValue,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen
  } = useAIChatInput();
  
  const isMobile = useIsMobile();

  // Automatically go fullscreen when messages are present and autoFullScreen is true
  useEffect(() => {
    if (autoFullScreen && messages.length > 0 && !isFullScreen) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsFullScreen(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, autoFullScreen, isFullScreen, setIsFullScreen]);

  // If in fullscreen mode, show FullScreenChat
  if (isFullScreen) {
    return (
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <ChatContainer
        containerRef={containerRef}
        showMessages={showMessages}
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        suggestedResponse={suggestedResponse}
        handleSend={handleSend}
        handleClear={handleClear}
        toggleFullScreen={toggleFullScreen}
        placeholder={placeholderText}
      />
    </AnimatePresence>
  );
}

export default AIChatInput;
