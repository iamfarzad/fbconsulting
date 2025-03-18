
import { useEffect } from "react";
import { useMessages } from "./useMessages";
import { useSuggestedResponse } from "./useSuggestedResponse";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useChatUIState } from "./chat/useChatUIState";
import { useChatInitialization } from "./chat/useChatInitialization";
import { useChatMessageHandler } from "./chat/useChatMessageHandler";
import { useToast } from "./use-toast";
import { LeadInfo } from '@/services/lead/leadExtractor';

export function useAIChatInput() {
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const { toast } = useToast();
  const { images, uploadImage, removeImage, clearImages, isUploading } = useImageUpload();
  
  // Extract UI state management
  const {
    showMessages,
    setShowMessages,
    isFullScreen,
    setIsFullScreen,
    containerRef,
    toggleFullScreen,
    getCurrentPage
  } = useChatUIState();
  
  // Extract chat initialization
  const { multimodalChatRef, initializeMultimodalChat } = useChatInitialization();
  
  // Create mock lead info for suggesting responses
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery' // Now using a valid literal value of LeadInfo.stage
  };
  
  // Get suggested response
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  
  // Extract message handling
  const {
    isLoading,
    inputValue,
    setInputValue,
    handleSend,
    handleClear: handleClearInternal
  } = useChatMessageHandler({
    addUserMessage,
    addAssistantMessage,
    setShowMessages,
    clearImages,
    messages
  });
  
  // Show messages when they exist
  useEffect(() => {
    if (messages.length > 0 && !showMessages) {
      setShowMessages(true);
    }
  }, [messages.length, showMessages, setShowMessages]);
  
  // Clear messages and chat history
  const handleClear = () => {
    clearMessages();
    clearImages();
    setShowMessages(false);
    handleClearInternal();
    
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  // Handle sending messages, possibly with images
  const handleSendWrapper = (imagesToSend?: { mimeType: string, data: string }[]) => {
    handleSend(images);
  };

  return {
    showMessages,
    messages,
    isLoading,
    inputValue,
    setInputValue,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend: handleSendWrapper,
    handleClear,
    setIsFullScreen,
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  };
}
