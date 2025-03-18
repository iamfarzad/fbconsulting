
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LeadInfo } from '@/services/lead/leadExtractor';
import { generateResponse } from '@/services/chat/responseGenerator';
import { GeminiMultimodalChat } from '@/services/gemini';
import { sendMultimodalRequest } from '@/services/gemini';

interface UseChatMessageHandlerProps {
  addUserMessage: (message: string) => void;
  addAssistantMessage: (message: string) => void;
  setShowMessages: (show: boolean) => void;
  multimodalChatRef: React.MutableRefObject<GeminiMultimodalChat | null>;
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
  multimodalChatRef,
  clearImages,
  messages
}: UseChatMessageHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  // Initialize the multimodal chat if needed
  const initializeIfNeeded = () => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    let apiKey = '';
    
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        apiKey = config.apiKey;
        
        if (apiKey && !multimodalChatRef.current) {
          multimodalChatRef.current = new GeminiMultimodalChat({
            apiKey,
            model: 'gemini-2.0-vision'
          });
        }
      } catch (error) {
        console.error('Error initializing multimodal chat:', error);
      }
    }
    
    return !!apiKey;
  };

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
      addUserMessage(inputValue);
      
      let aiResponse = '';
      const hasApiKey = initializeIfNeeded();
      
      if (!hasApiKey) {
        throw new Error('No API key found. Please configure Gemini in the settings.');
      }
      
      if (images && images.length > 0) {
        if (multimodalChatRef.current) {
          const imageData = images.map(img => ({
            mimeType: img.mimeType,
            data: img.data
          }));
          
          aiResponse = await multimodalChatRef.current.sendMessage(inputValue, imageData);
        } else {
          aiResponse = await sendMultimodalRequest(
            inputValue,
            images.map(img => ({
              mimeType: img.mimeType,
              data: img.data
            })),
            { 
              apiKey: JSON.parse(localStorage.getItem('GEMINI_CONFIG') || '{}').apiKey, 
              model: 'gemini-2.0-vision'
            }
          );
        }
      } else {
        const mockLeadInfo: LeadInfo = {
          interests: [...messages.map(m => m.content), inputValue],
          stage: 'discovery'
        };
        
        aiResponse = generateResponse(inputValue, mockLeadInfo);
      }
      
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
    
    if (!setShowMessages) {
      setShowMessages(true);
    }
  };

  // Handle clearing the chat
  const handleClear = () => {
    if (multimodalChatRef.current) {
      multimodalChatRef.current.clearHistory();
    }
  };

  return {
    isLoading,
    inputValue,
    setInputValue,
    handleSend,
    handleClear
  };
}
