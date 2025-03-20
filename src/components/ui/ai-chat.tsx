
"use client";

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnifiedChat } from "../chat/UnifiedChat";
import { UnifiedFullScreenChat } from "../chat/UnifiedFullScreenChat";
import { ChatProvider } from "@/contexts/ChatContext";

interface AIChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
}

export function AIChatInput({ 
  placeholderText = "Ask me anything...",
  autoFullScreen = false 
}: AIChatInputProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const isMobile = useIsMobile();

  // If autoFullScreen is true, go to fullscreen after a delay when mobile
  useEffect(() => {
    if (autoFullScreen && isMobile) {
      const timer = setTimeout(() => {
        setIsFullScreen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoFullScreen, isMobile]);

  // Handle toggling fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  return (
    <ChatProvider>
      <AnimatePresence mode="wait">
        {isFullScreen ? (
          <UnifiedFullScreenChat
            onMinimize={toggleFullScreen}
            placeholderText={placeholderText}
          />
        ) : (
          <UnifiedChat
            placeholderText={placeholderText}
            onToggleFullScreen={toggleFullScreen}
          />
        )}
      </AnimatePresence>
    </ChatProvider>
  );
}

export default AIChatInput;
