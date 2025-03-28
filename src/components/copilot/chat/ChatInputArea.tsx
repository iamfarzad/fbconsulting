
import React from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  toggleListening: () => void;
  isLoading: boolean;
  isListening: boolean;
  isInitialized: boolean;
  isProviderLoading: boolean;
  isVoiceSupported: boolean;
  error: string | null;
  voiceError: string | null;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  handleKeyDown,
  handleSendMessage,
  toggleListening,
  isLoading,
  isListening,
  isInitialized,
  isProviderLoading,
  isVoiceSupported,
  error,
  voiceError
}) => {
  const isDisabled = isLoading || isProviderLoading || !isInitialized || !!error;

  return (
    <div className="p-4 flex flex-col space-y-2">
      <div className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isDisabled
              ? 'AI assistant is loading...'
              : 'Type your message here...'
          }
          className="flex-1 min-h-[80px] max-h-[200px] resize-none"
          disabled={isDisabled || isListening}
        />

        <div className="flex flex-col space-y-2">
          {isVoiceSupported && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? 'destructive' : 'secondary'}
              onClick={toggleListening}
              disabled={isDisabled}
              className="flex-shrink-0"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            variant="default"
            onClick={handleSendMessage}
            disabled={isDisabled || !inputValue.trim()}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {voiceError && (
        <p className="text-sm text-destructive">{voiceError}</p>
      )}
    </div>
  );
};

export default ChatInputArea;
