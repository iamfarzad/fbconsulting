
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { AIMessage } from '@/services/chat/messageTypes';
import { useToast } from './use-toast';
import { useMessages } from './useMessages';
import { useLeadInfo } from './useLeadInfo';
import { useSuggestedResponse } from './useSuggestedResponse';
import { processMessage } from '@/utils/messageProcessor';

interface UseCopilotOptions {
  copilotApiKey?: string;
  initialMessages?: AIMessage[];
  initialLeadInfo?: LeadInfo;
}

interface UseCopilotReturn {
  messages: AIMessage[];
  leadInfo: LeadInfo;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  suggestedResponse: string | null;
  currentPersona: 'strategist' | 'technical' | 'consultant' | 'general';
}

export const useCopilot = (options: UseCopilotOptions = {}): UseCopilotReturn => {
  const { toast } = useToast();
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1] || 'home';
  
  // Get API key from options or default to environment variable
  const apiKey = options.copilotApiKey || 'dummy-key';
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the extracted hooks
  const { 
    messages, 
    addUserMessage, 
    addAssistantMessage, 
    addErrorMessage, 
    clearMessages 
  } = useMessages(options.initialMessages);
  
  const { 
    leadInfo, 
    currentPersona, 
    updateLeadInfo, 
    clearLeadInfo 
  } = useLeadInfo(options.initialLeadInfo);
  
  const suggestedResponse = useSuggestedResponse(leadInfo);
  
  // Function to send a message
  const sendMessage = useCallback(async (content: string) => {
    // Skip empty messages
    if (!content.trim()) return;
    
    // Add user message to the conversation
    addUserMessage(content);
    setIsLoading(true);
    
    try {
      // Extract lead info from the message
      const updatedLeadInfo = updateLeadInfo(content);
      
      // Get AI response
      const responseContent = await processMessage(content, updatedLeadInfo, currentPage);
      
      // Add AI response to the conversation
      addAssistantMessage(responseContent);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      addErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, addUserMessage, addAssistantMessage, addErrorMessage, updateLeadInfo]);
  
  // Function to clear the conversation and lead info
  const clearAllData = useCallback(() => {
    clearMessages();
    clearLeadInfo();
    
    toast({
      title: "Conversation cleared",
      description: "Starting a new conversation."
    });
  }, [clearMessages, clearLeadInfo, toast]);
  
  return {
    messages,
    leadInfo,
    sendMessage,
    clearMessages: clearAllData,
    isLoading,
    suggestedResponse,
    currentPersona
  };
};
