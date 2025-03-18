
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { GeminiMultimodalChat } from '@/services/gemini';
import { useChatInitialization } from './useChatInitialization';
import { useMessageProcessor } from './useMessageProcessor';

interface UseChatMessageHandlerProps {
  addUserMessage: (message: string) => void;
  addAssistantMessage: (message: string) => void;
  setShowMessages: (show: boolean) => void;
  clearImages: () => void;
  messages: any[];
}

/**
 * Hook to handle sending and receiving chat messages
 */
export function useChatMessageHandler({
  addUserMessage,
  addAssistantMessage,
  setShowMessages,
  clearImages,
  messages
}: UseChatMessageHandlerProps) {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  
  // Use the initialization hook
  const { 
    multimodalChatRef,
    hasApiKey,
    getApiKey,
    resetChat
  } = useChatInitialization();
  
  // Use the message processor hook
  const {
    isLoading,
    setIsLoading,
    processTextMessage,
    processMultimodalMessage
  } = useMessageProcessor();

  // Send a message
  const handleSend = async (images: { mimeType: string, data: string, preview: string }[] = []) => {
    if (!inputValue.trim() && images.length === 0) {
      toast({
        title: "Message is empty",
        description: "Please enter a message or add an image before sending.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Add the user message to the chat
      addUserMessage(inputValue);
      
      let aiResponse = '';
      
      // Validate API key for image messages
      if (images && images.length > 0) {
        if (!hasApiKey()) {
          throw new Error('No API key found. Please configure Gemini in the settings.');
        }
        
        // Try to use the multimodal chat reference if available
        if (multimodalChatRef.current) {
          const imageData = images.map(img => ({
            mimeType: img.mimeType,
            data: img.data
          }));
          
          aiResponse = await multimodalChatRef.current.sendMessage(inputValue, imageData);
        } else {
          // Fallback to direct API call
          aiResponse = await processMultimodalMessage(inputValue, images, getApiKey());
        }
      } else {
        // For text-only messages, use the mock lead info
        const mockLeadInfo: LeadInfo = {
          interests: [...messages.map(m => m.content), inputValue],
          stage: 'discovery' as const
        };
        
        aiResponse = await processTextMessage(inputValue, mockLeadInfo);
      }
      
      // Add the AI response to the chat
      addAssistantMessage(aiResponse);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
    
    setInputValue("");
    clearImages();
    
    if (!showMessages) {
      setShowMessages(true);
    }
  };

  // Handle clearing the chat
  const handleClear = () => {
    resetChat();
    setInputValue("");
  };

  return {
    isLoading,
    inputValue,
    setInputValue,
    handleSend,
    handleClear
  };
}
