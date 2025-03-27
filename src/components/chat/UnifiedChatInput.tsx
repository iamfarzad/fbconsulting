import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { FileAttachment } from '@/services/chat/types';

// Import our new components
import { ChatInputBox } from './input/ChatInputBox';
import { MediaPreview } from './input/MediaPreview';
import { TranscriptDisplay } from './input/TranscriptDisplay';
import { ChatInputActions } from './input/ChatInputActions';

interface UnifiedChatInputProps {
  placeholder?: string;
  className?: string;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  placeholder = 'Ask me anything...',
  className = '',
  onVoiceStart,
  onVoiceEnd
}) => {
  const { 
    state, 
    dispatch, 
    sendMessage,
    clearMessages,
    addMediaItem,
    removeMediaItem
  } = useChat();
  
  const { 
    inputValue, 
    isLoading, 
    suggestedResponse,
    showMessages,
    messages,
    mediaItems
  } = state;
  
  // Textarea auto-resize
  const {
    textareaRef,
    adjustHeight
  } = useAutoResizeTextarea({
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
    (value) => dispatch({ type: 'SET_INPUT_VALUE', payload: value }), 
    () => handleSend(),
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
  
  // Media upload toggle
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSend();
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value });
    adjustHeight();
  };
  
  const handleSend = () => {
    if (isLoading) return;
    if (!inputValue.trim() && mediaItems.length === 0) return;
    
    // Convert mediaItems to FileAttachment format
    const files: FileAttachment[] = mediaItems.map(item => ({
      mimeType: item.mimeType || '',
      data: item.data,
      name: item.name || 'file',
      type: item.type
    }));
    
    sendMessage(inputValue, files);
  };
  
  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      dispatch({ type: 'SET_INPUT_VALUE', payload: suggestedResponse });
      adjustHeight();
    }
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
    <div className={cn('w-full', className)}>
      {/* Voice transcription display */}
      <TranscriptDisplay isListening={isListening} transcript={transcript} />
      
      <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-black/20 dark:border-white/20 rounded-2xl transition-all duration-300 shadow-sm">
        <ChatInputBox
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholder}
          disabled={isLoading || isListening}
          textareaRef={textareaRef}
        />
        
        {/* Image/file previews */}
        <MediaPreview 
          mediaItems={mediaItems} 
          onRemove={removeMediaItem}
        />
        
        <ChatInputActions
          suggestedResponse={suggestedResponse}
          onSuggestionClick={handleSuggestionClick}
          onSend={handleSend}
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
          hasMessages={messages.filter(m => m.role !== 'system').length > 0}
          aiProcessing={aiProcessing}
        />
      </div>
      
      {/* Error message */}
      {voiceError && (
        <p className="mt-2 text-xs text-destructive">{voiceError}</p>
      )}
    </div>
  );
};
