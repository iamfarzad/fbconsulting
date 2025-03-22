
import { useCallback } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { FileAttachment } from '@/services/chat/types';

// Import our refactored hooks
import { useChatConnection } from './chat/useChatConnection';
import { useChatMessages } from './chat/useChatMessages';
import { useChatUI } from './chat/useChatUI';
import { useUnifiedChatVoice } from './chat/useUnifiedChatVoice';

interface UseUnifiedChatOptions {
  useCopilotKit?: boolean;
  apiKey?: string;
  modelName?: string;
}

export function useUnifiedChat(options: UseUnifiedChatOptions = {}) {
  const { useCopilotKit = false, apiKey, modelName } = options;
  
  // Get persona data
  const { personaData } = usePersonaManagement();
  
  // CopilotKit integration
  const copilotChat = useCopilotKit();
  
  // Setup chat connection
  const {
    chatService,
    connectionStatus,
    connectionError,
    retryConnection,
    initializeWithPersona
  } = useChatConnection({ apiKey, modelName });
  
  // Setup messages state and operations
  const {
    messages,
    isLoading,
    suggestedResponse,
    sendMessage: sendChatMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages: handleClear
  } = useChatMessages({ 
    chatService,
    personaData
  });
  
  // Setup UI state
  const {
    inputValue,
    setInputValue,
    isFullScreen,
    setIsFullScreen,
    showMessages,
    setShowMessages,
    containerRef,
    toggleFullScreen,
    getCurrentPage
  } = useChatUI();
  
  // Send a message with all integrations
  const handleSend = useCallback(async (mediaItems: FileAttachment[] = []) => {
    if (!inputValue.trim() && mediaItems.length === 0) return;
    
    try {
      // Send to chat service
      await sendChatMessage(inputValue);
      
      // Clear input after sending
      setInputValue('');
      
      // If using CopilotKit, also send message there
      if (useCopilotKit && !copilotChat.isLoading) {
        // Use type assertion to match the expected type
        copilotChat.appendMessage({
          type: 'user-message',
          payload: { content: inputValue }
        } as any);
      }
      
      // Show messages container if it's hidden
      if (!showMessages) {
        setShowMessages(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [inputValue, sendChatMessage, setInputValue, useCopilotKit, copilotChat, showMessages, setShowMessages]);
  
  // Setup voice integration
  const {
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError,
    handleVoiceCommand
  } = useUnifiedChatVoice({
    setInputValue,
    handleSend
  });

  return {
    // Connection state
    chatService,
    connectionStatus,
    connectionError,
    retryConnection,
    
    // Message state
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    
    // UI state
    containerRef,
    isFullScreen,
    toggleFullScreen,
    handleSend,
    handleClear,
    setIsFullScreen,
    setShowMessages,
    
    // Voice state
    isListening,
    transcript,
    toggleListening,
    isTranscribing,
    voiceError,
    
    // Message operations
    addUserMessage,
    addAssistantMessage
  };
}

export default useUnifiedChat;
