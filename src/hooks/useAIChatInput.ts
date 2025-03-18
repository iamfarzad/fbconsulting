
import { useEffect } from "react";
import { useMessages } from "./useMessages";
import { useSuggestedResponse } from "./useSuggestedResponse";
import { useFileUpload, UploadedFile } from "@/hooks/useFileUpload";
import { useChatUIState } from "./chat/useChatUIState";
import { useChatInitialization } from "./chat/useChatInitialization";
import { useChatMessageHandler } from "./chat/useChatMessageHandler";
import { useToast } from "./use-toast";
import { LeadInfo } from '@/services/lead/leadExtractor';

export function useAIChatInput() {
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const { toast } = useToast();
  const { files, uploadFile, removeFile, clearFiles, isUploading } = useFileUpload();
  
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
    clearFiles,
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
    clearFiles();
    setShowMessages(false);
    handleClearInternal();
    
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  // Handle sending messages, possibly with files
  const handleSendWrapper = (filesToSend?: { mimeType: string, data: string, name: string, type: string }[]) => {
    handleSend(files);
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
    files,
    uploadFile,
    removeFile,
    clearFiles,
    isUploading
  };
}
