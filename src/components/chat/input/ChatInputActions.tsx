
import React from 'react';
import { SuggestionButton } from '../core/SuggestionButton';
import { InputControls } from '../core/InputControls';

interface ChatInputActionsProps {
  suggestedResponse: string | null;
  onSuggestionClick: () => void;
  onSend: () => void;
  hasContent: boolean;
  isLoading: boolean;
  isListening: boolean;
  toggleListening?: () => void;
  isVoiceSupported?: boolean;
  onClearChat?: () => void;
  showMediaUpload: boolean;
  setShowMediaUpload: (show: boolean) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasMessages: boolean;
  aiProcessing?: boolean;
}

export const ChatInputActions: React.FC<ChatInputActionsProps> = ({
  suggestedResponse,
  onSuggestionClick,
  onSend,
  hasContent,
  isLoading,
  isListening,
  toggleListening,
  isVoiceSupported,
  onClearChat,
  showMediaUpload,
  setShowMediaUpload,
  onImageUpload,
  onFileUpload,
  hasMessages,
  aiProcessing
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center">
        {/* Left side actions (clear, etc) */}
        {hasMessages && (
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClearChat}
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
            onClick={onSuggestionClick}
            disabled={isLoading || isListening}
          />
        )}
        
        {/* Input controls */}
        <InputControls
          onSend={onSend}
          hasContent={hasContent}
          isLoading={isLoading}
          onToggleMic={isVoiceSupported ? toggleListening : undefined}
          isListening={isListening}
          isVoiceSupported={isVoiceSupported}
          onToggleMedia={() => setShowMediaUpload(!showMediaUpload)}
          showMedia={showMediaUpload}
          onUploadImage={onImageUpload}
          onUploadFile={onFileUpload}
          onClearChat={hasMessages ? onClearChat : undefined}
          aiProcessing={aiProcessing}
        />
      </div>
    </div>
  );
};
