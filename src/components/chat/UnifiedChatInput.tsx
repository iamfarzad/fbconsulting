
import React, { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import { TypingIndicator } from './core/TypingIndicator';
import { InputControls } from './core/InputControls';
import { SuggestionButton } from './core/SuggestionButton';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { FileAttachment } from '@/services/chat/types';

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
    removeMediaItem,
    clearMediaItems
  } = useChat();
  
  const { 
    inputValue, 
    isLoading, 
    suggestedResponse,
    showMessages,
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
    isTranscribing,
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
  const [showMediaUpload, setShowMediaUpload] = React.useState(false);
  
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
      {isListening && transcript && (
        <div className="mb-2 p-2 bg-primary-foreground rounded text-sm">
          {transcript}
        </div>
      )}
      
      <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-black/20 dark:border-white/20 rounded-2xl transition-all duration-300 shadow-sm">
        <Textarea 
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholder}
          className={cn(
            'w-full px-4 py-3',
            'resize-none',
            'bg-transparent',
            'border-none',
            'text-black/90 dark:text-white/90 text-sm',
            'focus:outline-none',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'placeholder:text-black/50 dark:placeholder:text-white/50 placeholder:text-sm',
            'min-h-[60px] rounded-2xl'
          )}
          style={{ overflow: 'hidden' }}
          disabled={isLoading || isListening}
        />
        
        {/* Image/file previews */}
        {mediaItems.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {mediaItems.map((item, index) => (
              <div 
                key={index} 
                className="relative group h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center"
              >
                {item.type === 'image' ? (
                  <img 
                    src={item.data} 
                    alt={item.name || 'Uploaded image'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-xs p-1">
                    <span className="truncate w-full text-center">
                      {item.name || 'File'}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeMediaItem(index)}
                  className="absolute top-0 right-0 bg-black/60 text-white p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between p-3 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center">
            {/* Left side actions (clear, etc) */}
            {showMessages && messages.length > 0 && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearMessages}
              >
                Clear Chat
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Suggested response */}
            {suggestedResponse && (
              <SuggestionButton
                suggestion={suggestedResponse}
                onClick={handleSuggestionClick}
                disabled={isLoading || isListening}
              />
            )}
            
            {/* Input controls */}
            <InputControls
              onSend={handleSend}
              hasContent={inputValue.trim().length > 0 || mediaItems.length > 0}
              isLoading={isLoading}
              onToggleMic={isVoiceSupported ? toggleListening : undefined}
              isListening={isListening}
              isVoiceSupported={isVoiceSupported}
              aiProcessing={aiProcessing}
              onToggleMedia={() => setShowMediaUpload(!showMediaUpload)}
              showMedia={showMediaUpload}
              onUploadImage={handleImageUpload}
              onUploadFile={handleFileUpload}
              onClearChat={messages.length > 0 ? clearMessages : undefined}
            />
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {voiceError && (
        <p className="mt-2 text-xs text-destructive">{voiceError}</p>
      )}
    </div>
  );
};
