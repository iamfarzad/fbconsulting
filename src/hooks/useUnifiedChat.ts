import { useCallback } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import { useToast } from '@/components/ui/use-toast';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { FileAttachment } from '@/services/chat/types';
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
  const { toast } = useToast();

  // Get persona data
  const { personaData } = usePersonaManagement();
  
  // CopilotKit integration - always call the hook but only use result if enabled
  const copilotChat = useCopilotChat();
  
  // Setup chat connection
  const {
    chatService,
    connectionStatus,
    connectionError,
    retryConnection,
    initializeWithPersona
  } = useChatConnection({ 
    apiKey, 
    modelName,
    onError: (error) => {
      toast({
        title: "Chat Service Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
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
    if (!inputValue.trim() && mediaItems.length === 0) {
      toast({
        title: 'Message is empty',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Send to chat service
      await sendChatMessage(inputValue);
      
      // Clear input after sending
      setInputValue('');
      
      // If using CopilotKit, also send message there
      if (useCopilotKit && !copilotChat.isLoading) {
        const copilotMessage = new TextMessage({
          role: Role.User,
          content: inputValue,
          id: Date.now().toString(),
          createdAt: new Date()
        });
        copilotChat.appendMessage(copilotMessage);
      }
      
      // Show messages container if it's hidden
      if (!showMessages) {
        setShowMessages(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [inputValue, sendChatMessage, setInputValue, useCopilotKit, copilotChat, showMessages, setShowMessages, toast]);
  
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
