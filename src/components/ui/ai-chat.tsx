
"use client";

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnifiedChat } from "../chat/UnifiedChat";
import UnifiedFullScreenChat from "../chat/UnifiedFullScreenChat";

interface AIChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function AIChatInput({ 
  placeholderText = "Ask me anything...",
  autoFullScreen = false,
  apiKey,
  modelName
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
    <AnimatePresence mode="wait">
      {isFullScreen ? (
        <UnifiedFullScreenChat
          onMinimize={toggleFullScreen}
          placeholderText={placeholderText}
          apiKey={apiKey}
          modelName={modelName}
        />
      ) : (
        <UnifiedChat
          placeholder={placeholderText}
          onToggleFullScreen={toggleFullScreen}
          apiKey={apiKey}
          modelName={modelName}
        />
      )}
    </AnimatePresence>
  );
}

export default AIChatInput;
