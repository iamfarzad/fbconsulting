/**
 * UnifiedChatInput Component
 * A unified chat input component that can be used across the application
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import UnifiedFullScreenChat from '@/components/chat/UnifiedFullScreenChat';
import { ChatContainer } from './ChatContainer';

interface UnifiedChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
  useCopilotKit?: boolean;
}

export function UnifiedChatInput({
  placeholderText = "Ask me anything...",
  autoFullScreen = false,
  useCopilotKit = true
}: UnifiedChatInputProps) {
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
  } = useUnifiedChat({ useCopilotKit });
  
  const isMobile = useIsMobile();

  // Automatically go fullscreen when messages are present and autoFullScreen is true
  useEffect(() => {
    if (autoFullScreen && messages.length > 1 && !isFullScreen) { // > 1 to account for system message
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsFullScreen(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, autoFullScreen, isFullScreen, setIsFullScreen]);

  // If in fullscreen mode, show UnifiedFullScreenChat
  if (isFullScreen) {
    return (
      <AnimatePresence mode="wait">
        <UnifiedFullScreenChat
          onMinimize={toggleFullScreen}
          useCopilotKit={useCopilotKit}
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
        messages={messages.filter(msg => msg.role !== 'system')}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        suggestedResponse={suggestedResponse}
        handleSend={handleSend}
        handleClear={handleClear}
        toggleFullScreen={toggleFullScreen}
        placeholder={placeholderText}
        isFullScreen={false}
      />
    </AnimatePresence>
  );
}

export default UnifiedChatInput;
