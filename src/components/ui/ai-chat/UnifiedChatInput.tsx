
/**
 * UnifiedChatInput Component
 * A unified chat input component that can be used across the application
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedFullScreenChat } from '@/components/chat/UnifiedFullScreenChat';
import { ChatContainer } from './ChatContainer';
import { AIMessage } from '@/services/chat/types';

interface UnifiedChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function UnifiedChatInput({
  placeholderText = "Ask me anything...",
  autoFullScreen = false,
  apiKey,
  modelName
}: UnifiedChatInputProps) {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen,
    setShowMessages
  } = useUnifiedChat({ 
    apiKey,
    modelName
  });
  
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
          placeholderText={placeholderText}
          apiKey={apiKey}
          modelName={modelName}
        />
      </AnimatePresence>
    );
  }

  // Ensure messages have the required timestamp field
  const validMessages: AIMessage[] = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      ...msg,
      timestamp: msg.timestamp || Date.now()
    }));

  return (
    <AnimatePresence mode="wait">
      <ChatContainer
        containerRef={containerRef}
        showMessages={showMessages}
        messages={validMessages}
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
