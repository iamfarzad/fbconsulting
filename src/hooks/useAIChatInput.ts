
import { useState, useEffect, useRef } from "react";
import { useMessages } from "./useMessages";
import { useSuggestedResponse } from "./useSuggestedResponse";
import { LeadInfo } from "@/services/lead/leadExtractor";
import { generateResponse } from "@/services/chat/responseGenerator";
import { useToast } from "./use-toast";
import { useLocation } from "react-router-dom";
import { sendMultimodalRequest } from "@/services/gemini";
import { useImageUpload } from "@/hooks/useImageUpload";

export function useAIChatInput() {
  const [showMessages, setShowMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Add image upload functionality
  const {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  } = useImageUpload();
  
  // Create a mock LeadInfo object for suggestions
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery'
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);

  // Calculate container height based on content - added safety checks
  const calculateContainerHeight = () => {
    if (containerRef.current && typeof window !== 'undefined') {
      // Update max-height based on viewport if needed
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600); // 70% of viewport height or 600px, whichever is smaller
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  // Update container height on window resize with cleanup
  useEffect(() => {
    calculateContainerHeight();
    
    // Safety check for window
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, []);

  // Show messages container when first message is sent
  useEffect(() => {
    if (messages.length > 0 && !showMessages) {
      setShowMessages(true);
    }
  }, [messages.length, showMessages]);

  // Extract current page from path
  const getCurrentPage = (): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1); // Remove leading slash
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  const handleSend = async (images?: { mimeType: string; data: string }[]) => {
    if (!inputValue.trim() && (!images || images.length === 0)) {
      toast({
        title: "Message is empty",
        description: "Please enter a message or add an image before sending.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Add user message to chat
      addUserMessage(inputValue);
      
      let aiResponse = '';
      
      // Get Gemini API key from localStorage
      const savedConfig = localStorage.getItem('GEMINI_CONFIG');
      let apiKey = '';
      let modelName = 'gemini-2.0-pro-001';
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          apiKey = config.apiKey;
          if (config.modelName) {
            modelName = config.modelName;
          }
        } catch (error) {
          console.error('Error parsing saved configuration:', error);
        }
      }
      
      if (!apiKey) {
        throw new Error('No API key found. Please configure Gemini in the settings.');
      }
      
      // If we have images, use vision API
      if (images && images.length > 0) {
        // Use the multimodal API
        aiResponse = await sendMultimodalRequest(
          inputValue,
          images,
          { 
            apiKey, 
            model: 'gemini-2.0-vision-001' // Use vision model
          }
        );
      } else {
        // Create mock lead info from conversation context
        const mockLeadInfo: LeadInfo = {
          interests: [...messages.map(m => m.content), inputValue],
          stage: 'discovery'
        };
        
        // Generate AI response with possible graphic cards
        aiResponse = generateResponse(inputValue, mockLeadInfo);
      }
      
      // Add the response to the chat
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
    
    // Clear any uploaded images after sending
    clearImages();
    
    // Show messages container when first message is sent
    if (!showMessages) {
      setShowMessages(true);
    }
  };

  const handleClear = () => {
    clearMessages();
    clearImages();
    setShowMessages(false);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
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
    handleSend,
    handleClear,
    setIsFullScreen,
    // Export image upload functionality
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  };
}
