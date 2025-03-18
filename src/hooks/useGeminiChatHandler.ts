
import { useState } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useImageUpload } from './useImageUpload';
import { useGeminiInitialization } from './gemini/useGeminiInitialization';
import { useGeminiMessages } from './gemini/useGeminiMessages';
import { useGeminiMessageSubmission } from './gemini/useGeminiMessageSubmission';

/**
 * Main hook for handling Gemini chat functionality
 */
export function useGeminiChatHandler() {
  const [inputValue, setInputValue] = useState('');
  
  // Initialize Gemini
  const {
    isInitialized,
    isProviderLoading,
    error: initError,
    providerError,
    currentPersonaName,
    multimodalChatRef,
    personaData
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
  
  // Voice recognition
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition();
  
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
  
  // Handle voice transcription
  useState(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  });
  
  // Combined error from multiple sources
  const error = initError || sendError;

  // Main handler for sending messages
  const sendMessage = async () => {
    await handleSendMessage(inputValue, images, isListening, () => {});
    setInputValue('');
  };

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
    isUploading
  };
}
