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
  
  const {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  } = useImageUpload();
  
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery'
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);

  const calculateContainerHeight = () => {
    if (containerRef.current && typeof window !== 'undefined') {
      const vh = window.innerHeight;
      const maxHeight = Math.min(vh * 0.7, 600);
      containerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  };

  useEffect(() => {
    calculateContainerHeight();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateContainerHeight);
      return () => window.removeEventListener('resize', calculateContainerHeight);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !showMessages) {
      setShowMessages(true);
    }
  }, [messages.length, showMessages]);

  const getCurrentPage = (): string | undefined => {
    if (currentPath === '/') return 'home';
    return currentPath.substring(1);
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
      addUserMessage(inputValue);
      
      let aiResponse = '';
      
      const savedConfig = localStorage.getItem('GEMINI_CONFIG');
      let apiKey = '';
      let modelName = 'gemini-2.0-flash';
      
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
      
      if (images && images.length > 0) {
        aiResponse = await sendMultimodalRequest(
          inputValue,
          images,
          { 
            apiKey, 
            model: 'gemini-2.0-vision'
          }
        );
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
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  };
}
