
import { useState, useEffect } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useImageUpload } from './useImageUpload';
import { useGeminiInitialization } from './gemini/useGeminiInitialization';
import { useGeminiMessages } from './gemini/useGeminiMessages';
import { useGeminiMessageSubmission } from './gemini/useGeminiMessageSubmission';
import { useToast } from './use-toast';

/**
 * Main hook for handling Gemini chat functionality
 */
export function useGeminiChatHandler() {
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  
  // Initialize Gemini
  const {
    isInitialized,
    isProviderLoading,
    error: initError,
    providerError,
    currentPersonaName,
    multimodalChatRef,
    personaData,
    hasApiKey,
    getApiKey
  } = useGeminiInitialization();
  
  // Manage messages
  const {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages,
    messagesEndRef
  } = useGeminiMessages(personaData);
  
  // Image handling
  const {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  } = useImageUpload();
  
  // Voice recognition with toast notifications
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition((command) => {
    if (command.trim()) {
      setInputValue(command);
      // Auto-send after short delay to give user time to see what was recognized
      setTimeout(() => {
        handleSendMessage(command, images, false, () => {});
        setInputValue('');
      }, 500);
    }
  });
  
  // Handle message submission
  const {
    error: sendError,
    handleSendMessage,
    handleKeyDown
  } = useGeminiMessageSubmission({
    addMessage,
    setIsLoading,
    clearImages,
    multimodalChatRef
  });
  
  // Show toast for voice errors
  useEffect(() => {
    if (voiceError) {
      toast({
        title: "Voice Recognition Error",
        description: voiceError,
        variant: "destructive"
      });
    }
  }, [voiceError, toast]);
  
  // Combined error from multiple sources
  const error = initError || sendError;

  // Main handler for sending messages
  const sendMessage = async () => {
    await handleSendMessage(inputValue, images, isListening, () => {});
    setInputValue('');
  };

  // Check if API key is valid
  const hasValidApiKey = hasApiKey();

  return {
    inputValue,
    setInputValue,
    messages,
    isLoading,
    isProviderLoading,
    isInitialized,
    isListening,
    transcript,
    handleSendMessage: sendMessage,
    handleKeyDown,
    toggleListening,
    clearMessages,
    messagesEndRef,
    currentPersonaName,
    error,
    providerError,
    voiceError,
    isVoiceSupported,
    // Image handling
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading,
    // API key status
    hasValidApiKey
  };
}
