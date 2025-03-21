
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { useChatInitialization } from './useChatInitialization';
import { useMessageProcessor } from './useMessageProcessor';

interface UseChatMessageHandlerProps {
  addUserMessage: (message: string) => void;
  addAssistantMessage: (message: string) => void;
  setShowMessages: (show: boolean) => void;
  clearFiles: () => void;
  messages: any[];
}

/**
 * Hook to handle sending and receiving chat messages
 */
export function useChatMessageHandler({
  addUserMessage,
  addAssistantMessage,
  setShowMessages,
  clearFiles,
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
  const handleSend = async (files: { mimeType: string, data: string, name: string, type: string }[] = []) => {
    if (!inputValue.trim() && files.length === 0) {
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
      
      // Check if we have an API key for Gemini
      if (hasApiKey()) {
        try {
          if (files && files.length > 0) {
            // Process multimodal messages with files
            if (multimodalChatRef.current) {
              const imageData = files
                .filter(file => file.type === 'image')
                .map(img => ({
                  mimeType: img.mimeType,
                  data: img.data
                }));
              
              aiResponse = await multimodalChatRef.current.sendMessage(inputValue, imageData);
            } else {
              // Fallback to direct API call
              const imageData = files
                .filter(file => file.type === 'image')
                .map(img => ({
                  mimeType: img.mimeType,
                  data: img.data
                }));
              
              aiResponse = await processMultimodalMessage(inputValue, imageData, getApiKey());
            }
          } else {
            // For text-only messages, also use Gemini if available
            if (multimodalChatRef.current) {
              aiResponse = await multimodalChatRef.current.sendMessage(inputValue);
            } else {
              // Use the text model through API
              const mockLeadInfo: LeadInfo = {
                interests: [...messages.map(m => m.content), inputValue],
                stage: 'discovery' as const
              };
              
              // Use the model directly for text messages
              aiResponse = await processMultimodalMessage(inputValue, [], getApiKey());
            }
          }
        } catch (error) {
          console.error("Gemini API error:", error);
          toast({
            title: "AI Service Error",
            description: "Could not connect to Gemini. Using fallback response instead.",
            variant: "destructive",
          });
          
          // Fallback to mock response
          const mockLeadInfo: LeadInfo = {
            interests: [...messages.map(m => m.content), inputValue],
            stage: 'discovery' as const
          };
          
          aiResponse = await processTextMessage(inputValue, mockLeadInfo);
        }
      } else {
        // No API key, use mock response generator
        const mockLeadInfo: LeadInfo = {
          interests: [...messages.map(m => m.content), inputValue],
          stage: 'discovery' as const
        };
        
        aiResponse = await processTextMessage(inputValue, mockLeadInfo);
        
        // Show a toast suggesting to set up Gemini
        toast({
          title: "Using Demo Mode",
          description: "Set up Gemini API Key in the settings for full AI features.",
        });
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
    clearFiles();
    
    // Fixed: We're using setShowMessages directly, not checking showMessages
    setShowMessages(true);
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
