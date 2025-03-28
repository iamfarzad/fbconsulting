
/**
 * UnifiedChatInput Component
 * A unified chat input component that can be used across the application
 */

import React, { useState, useEffect, useRef } from 'react';
import { useUnifiedChat } from '@/hooks/useUnifiedChat';
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { UnifiedFullScreenChat } from '@/components/chat/UnifiedFullScreenChat';
import { ChatContainer } from './ChatContainer';
import { AIMessage } from '@/services/chat/messageTypes';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { ChatInputBox } from './input/ChatInputBox';
import { MediaPreview } from './input/MediaPreview';
import { VoiceInputArea } from './input/VoiceInputArea';
import { SuggestionArea } from './input/SuggestionArea';
import { ChatActions } from './input/ChatActions';

interface UnifiedChatInputProps {
  placeholderText?: string;
  autoFullScreen?: boolean;
  apiKey?: string;
  modelName?: string;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  className?: string;
}

export function UnifiedChatInput({
  placeholderText = "Ask me anything...",
  autoFullScreen = false,
  apiKey,
  modelName,
  onVoiceStart,
  onVoiceEnd,
  className = ''
}: UnifiedChatInputProps) {
  // Core chat state and functionality
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showMessages,
    suggestedResponse,
    containerRef,
    isFullScreen,
    toggleFullScreen,
    sendMessage,
    clearMessages,
    setIsFullScreen,
    setShowMessages
  } = useUnifiedChat({ 
    apiKey,
    modelName
  });
  
  const isMobile = useIsMobile();
  const [mediaItems, setMediaItems] = useState<Array<{
    type: string,
    data: string,
    name?: string,
    mimeType?: string
  }>>([]);

  // Handle auto full screen mode
  useEffect(() => {
    if (autoFullScreen && messages.length > 1 && !isFullScreen) {
      const timer = setTimeout(() => {
        setIsFullScreen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length, autoFullScreen, isFullScreen, setIsFullScreen]);

  // Return full screen view if active
  if (isFullScreen) {
    return (
      <AnimatePresence mode="wait">
        <UnifiedFullScreenChat
          onMinimize={toggleFullScreen}
          placeholderText={placeholderText}
          apiKey={apiKey}
          modelName={modelName}
        />
      </AnimatePresence>
    );
  }

  // Ensure messages have the required timestamp field
  const validMessages: AIMessage[] = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      ...msg,
      timestamp: msg.timestamp || Date.now()
    }));

  // Textarea auto-resize
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200
  });
  
  // Voice input
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    aiProcessing,
    isVoiceSupported
  } = useVoiceInput(
    (value) => setInputValue(value), 
    () => handleSendMessage(),
    {
      autoStop: true,
      stopAfterSeconds: 10,
      continuousListening: false
    }
  );
  
  // Call onVoiceStart/onVoiceEnd callbacks when listening state changes
  useEffect(() => {
    if (isListening && onVoiceStart) {
      onVoiceStart();
    } else if (!isListening && onVoiceEnd) {
      onVoiceEnd();
    }
  }, [isListening, onVoiceStart, onVoiceEnd]);
  
  // Update textarea height when input value changes
  useEffect(() => {
    adjustHeight();
  }, [inputValue, adjustHeight]);
  
  // Media upload state
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  
  // Input handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustHeight();
  };
  
  const handleSendMessage = () => {
    if (isLoading) return;
    if (!inputValue.trim() && mediaItems.length === 0) return;
    
    // Convert mediaItems to FileAttachment format
    const files = mediaItems.map(item => ({
      mimeType: item.mimeType || '',
      data: item.data,
      name: item.name || 'file',
      type: item.type
    }));
    
    sendMessage(inputValue, files);
    setMediaItems([]); // Clear media items after sending
    setShowMediaUpload(false); // Hide media upload panel
  };
  
  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      setInputValue(suggestedResponse);
      adjustHeight();
    }
  };
  
  // Media handlers
  const addMediaItem = (item: {
    type: string,
    data: string,
    mimeType?: string,
    name?: string
  }) => {
    setMediaItems(prev => [...prev, item]);
  };
  
  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      addMediaItem({
        type: 'image',
        data,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      addMediaItem({
        type: 'file',
        data,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
    
    // Reset the input
    e.target.value = '';
  };

  return (
    <div className={className}>
      {/* Voice transcription display */}
      <VoiceInputArea 
        isListening={isListening} 
        transcript={transcript} 
        toggleListening={toggleListening}
        isDisabled={isLoading}
      />
      
      {/* Suggested response */}
      <SuggestionArea 
        suggestion={suggestedResponse} 
        onSuggestionClick={handleSuggestionClick} 
      />
      
      <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-black/20 dark:border-white/20 rounded-2xl transition-all duration-300 shadow-sm">
        {/* Text input area */}
        <ChatInputBox
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholderText}
          disabled={isLoading || isListening}
          textareaRef={textareaRef}
        />
        
        {/* File/image previews */}
        <MediaPreview 
          mediaItems={mediaItems} 
          onRemove={removeMediaItem}
        />
        
        {/* Action buttons */}
        <ChatActions
          suggestedResponse={suggestedResponse}
          onSuggestionClick={handleSuggestionClick}
          onSend={handleSendMessage}
          hasContent={inputValue.trim().length > 0 || mediaItems.length > 0}
          isLoading={isLoading}
          isListening={isListening}
          toggleListening={toggleListening}
          isVoiceSupported={isVoiceSupported}
          onClearChat={clearMessages}
          showMediaUpload={showMediaUpload}
          setShowMediaUpload={setShowMediaUpload}
          onImageUpload={handleImageUpload}
          onFileUpload={handleFileUpload}
          hasMessages={Array.isArray(messages) && messages.filter(m => m.role !== 'system').length > 0}
          aiProcessing={aiProcessing}
          fileInputRef={fileInputRef}
          documentInputRef={documentInputRef}
        />
      </div>
      
      {/* Error message */}
      {voiceError && (
        <p className="mt-2 text-xs text-destructive">{voiceError}</p>
      )}
      
      {/* Fallback UI for invalid messages format */}
      {!Array.isArray(messages) && (
        <div className="text-center text-red-500">
          Invalid messages format. Please try again.
        </div>
      )}
    </div>
  );
}

export default UnifiedChatInput;
