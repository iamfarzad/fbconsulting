import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import { TranscriptDisplay } from './TranscriptDisplay';
import { ChatInputBox } from './ChatInputBox';
import { MediaPreview } from './MediaPreview';
import { ChatInputActions } from './ChatInputActions';

interface UnifiedChatInputProps {
  placeholder?: string;
  className?: string;
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  placeholder = 'Type your message...',
  className
}) => {
  const { state, dispatch, sendMessage } = useChat();
  const { inputValue, isLoading, messages } = state;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State for enhanced features
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);
  const [isVoiceSupported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  const [aiProcessing, setAiProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && mediaItems.length === 0 || isLoading) return;

    try {
      setAiProcessing(true);
      await sendMessage(inputValue, mediaItems);
      dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
      setMediaItems([]);
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    } finally {
      setAiProcessing(false);
    }
  };

  const handleChange = (value: string) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch({ type: 'SET_INPUT_VALUE', payload: suggestion });
  };

  const handleSend = () => {
    const event = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(event);
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const handleImageUpload = (files: File[]) => {
    const newMediaItems = files.map(file => ({
      type: 'image',
      file,
      preview: URL.createObjectURL(file)
    }));
    setMediaItems(prev => [...prev, ...newMediaItems]);
  };

  const handleFileUpload = (files: File[]) => {
    const newMediaItems = files.map(file => ({
      type: 'file',
      file,
      name: file.name
    }));
    setMediaItems(prev => [...prev, ...newMediaItems]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
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
          hasMessages={Array.isArray(messages) && messages.filter(m => m.role !== 'system').length > 0}
          aiProcessing={aiProcessing}
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
};
