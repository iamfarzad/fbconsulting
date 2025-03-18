
import { useState, useEffect, useRef } from "react";
import { useMessages } from "./useMessages";
import { useSuggestedResponse } from "./useSuggestedResponse";
import { LeadInfo } from "@/services/lead/leadExtractor";
import { generateResponse } from "@/services/chat/responseGenerator";
import { useToast } from "./use-toast";
import { useLocation } from "react-router-dom";
import { sendMultimodalRequest, GeminiMultimodalChat } from "@/services/gemini";
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
  const multimodalChatRef = useRef<GeminiMultimodalChat | null>(null);
  
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

  // Initialize multimodal chat if needed
  const initializeMultimodalChat = () => {
    // Get API key and model configuration
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
      const hasApiKey = initializeMultimodalChat();
      
      if (!hasApiKey) {
        throw new Error('No API key found. Please configure Gemini in the settings.');
      }
      
      if (images && images.length > 0) {
        // Use the multimodal chat for image-based conversations
        if (multimodalChatRef.current) {
          aiResponse = await multimodalChatRef.current.sendMessage(inputValue, images);
        } else {
          // Fallback to individual request if chat initialization failed
          aiResponse = await sendMultimodalRequest(
            inputValue,
            images,
            { 
              apiKey: JSON.parse(localStorage.getItem('GEMINI_CONFIG') || '{}').apiKey, 
              model: 'gemini-2.0-vision'
            }
          );
        }
      } else {
        // For text-only responses, use the mock generator for now
        // In a real implementation, you'd use the Gemini chat here too
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
    
    // Also clear the multimodal chat history
    if (multimodalChatRef.current) {
      multimodalChatRef.current.clearHistory();
    }
    
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
