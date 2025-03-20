
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
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  placeholder = 'Ask me anything...',
  className
}) => {
  const { 
    state, 
    dispatch, 
    sendMessage 
  } = useChat();
  
  const { 
    inputValue, 
    isLoading, 
    suggestedResponse,
    showMessages
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
    () => handleSend()
  );
  
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
    if (!inputValue.trim()) return;
    
    // We'll pass an empty array for files since this implementation doesn't support them yet
    const files: FileAttachment[] = [];
    sendMessage(inputValue, files);
  };
  
  const handleSuggestionClick = () => {
    if (suggestedResponse) {
      dispatch({ type: 'SET_INPUT_VALUE', payload: suggestedResponse });
      adjustHeight();
    }
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
        
        <div className="flex items-center justify-between p-3 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center">
            {/* Left side actions (clear, etc) */}
            {showMessages && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => dispatch({ type: 'SET_SHOW_MESSAGES', payload: false })}
              >
                Hide Messages
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
              hasContent={inputValue.trim().length > 0}
              isLoading={isLoading}
              onToggleMic={isVoiceSupported ? toggleListening : undefined}
              isListening={isListening}
              isVoiceSupported={isVoiceSupported}
              onToggleMedia={() => setShowMediaUpload(!showMediaUpload)}
              showMedia={showMediaUpload}
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
