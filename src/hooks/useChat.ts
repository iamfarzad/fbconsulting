
import { useState, useRef, useCallback, useEffect } from 'react';
import { AIMessage } from '@/services/chat/messageTypes';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { nanoid } from 'nanoid';

// Mock for now - will be replaced by actual implementation
const sendMessageToBackend = async (message: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `AI response to: ${message}`;
};

export function useChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // File upload handling
  const { 
    files, 
    isUploading, 
    uploadFile, 
    removeFile, 
    clearFiles 
  } = useFileUpload();
  
  // Add a message to the chat
  const addMessage = useCallback((role: 'user' | 'assistant' | 'system' | 'error', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: Date.now(),
      id: nanoid()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  // Handle sending a message
  const handleSend = useCallback(async (mediaFiles = files) => {
    if (!inputValue.trim() && (!mediaFiles || mediaFiles.length === 0)) {
      toast({
        title: "Message is empty",
        description: "Please enter a message or add an image before sending.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setShowMessages(true);
    
    try {
      // Add user message
      addMessage('user', inputValue);
      
      // Request response from AI
      const response = await sendMessageToBackend(inputValue);
      
      // Add AI response
      addMessage('assistant', response);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setInputValue('');
      clearFiles();
    }
  }, [inputValue, files, addMessage, toast, clearFiles]);
  
  // Handle clearing the chat
  const handleClear = useCallback(() => {
    setMessages([]);
    setShowMessages(false);
    setSuggestedResponse(null);
    clearFiles();
    
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  }, [toast, clearFiles]);
  
  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);
  
  return {
    // State
    messages,
    inputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    isFullScreen,
    files,
    isUploading,
    
    // Actions
    setInputValue,
    setShowMessages,
    setSuggestedResponse,
    handleSend,
    handleClear,
    toggleFullScreen,
    uploadFile,
    removeFile,
    clearFiles,
    
    // Refs
    containerRef
  };
}
