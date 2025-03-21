import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useGeminiService, useGeminiConfig } from '@/hooks/gemini';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '../chat/ChatHeader';
import { ChatMessages } from '../chat/ChatMessages';
import { ChatInputArea } from '../chat/ChatInputArea';
import { ErrorDisplay } from '../chat/ErrorDisplay';

export const GeminiChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Core Gemini service functionality
  const {
    messages,
    isLoading,
    error: serviceError,
    sendMessage,
    clearMessages,
    isConnected,
    isConnecting
  } = useGeminiService({
    onError: (error) => {
      toast({
        title: "AI Service Error",
        description: error,
        variant: "destructive"
      });
    }
  });

  // Configuration validation
  const { apiKey: hasValidApiKey, modelName: currentPersonaName } = useGeminiConfig();
  
  // Image upload functionality
  const {
    images,
    uploadImage,
    removeImage,
    clearImages,
    isUploading
  } = useImageUpload();

  // Voice recognition with auto-send
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useSpeechRecognition((command) => {
    if (command.trim()) {
      setInputValue(command);
      setTimeout(() => {
        handleMessageSend(command);
        setInputValue('');
      }, 500);
    }
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice error handling
  useEffect(() => {
    if (voiceError) {
      toast({
        title: "Voice Recognition Error",
        description: voiceError,
        variant: "destructive"
      });
    }
  }, [voiceError, toast]);

  // Message sending handler
  const handleMessageSend = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      // First, upload any images if present
      let messageText = content;
      if (images.length > 0) {
        // Call the image upload API here
        // For now, append image info to the message
        messageText += `\n\nWith ${images.length} attached image(s)`;
      }
      
      await sendMessage(messageText);
      setInputValue('');
      clearImages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend(inputValue);
    }
  };

  const error = serviceError || voiceError;
  const isProviderLoading = isConnecting;
  const isInitialized = isConnected;
  
  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
      <ChatHeader 
        personaName={currentPersonaName}
        isLoading={isProviderLoading}
        messagesCount={messages.length}
        onClear={clearMessages}
        isUsingMockData={!hasValidApiKey}
        isConnected={isInitialized}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && <ErrorDisplay error={error} />}
        
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
          isProviderLoading={isProviderLoading}
          isListening={isListening}
          transcript={transcript}
          error={error}
          messagesEndRef={messagesEndRef}
          isInitialized={isInitialized}
        />
      </div>
      
      <ChatInputArea 
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyDown={handleKeyDown}
        handleSendMessage={() => handleMessageSend(inputValue)}
        toggleListening={toggleListening}
        isLoading={isLoading}
        isListening={isListening}
        isInitialized={isInitialized}
        isProviderLoading={isProviderLoading}
        isVoiceSupported={isVoiceSupported}
        error={error}
        voiceError={voiceError}
        images={images}
        onUploadImage={uploadImage}
        onRemoveImage={removeImage}
        isUploading={isUploading}
      />
    </div>
  );
};

export default GeminiChat;
