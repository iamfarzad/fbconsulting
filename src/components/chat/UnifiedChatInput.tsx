
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { ChatInputProps } from '@/types/chat';

export const UnifiedChatInput: React.FC<ChatInputProps> = ({
  placeholder = "Type your message..."
}) => {
  const { state, actions } = useChat();
  const { inputValue, isLoading } = state;
  const { sendMessage, setInputValue } = actions;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
  };

  return (
    <div className="flex items-end gap-2 border rounded-lg focus-within:ring-1 focus-within:ring-primary">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] max-h-[200px]"
        disabled={isLoading}
        rows={1}
      />
      
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleSend}
        disabled={isLoading || !inputValue.trim()}
        className="mb-2 mr-2 h-8 w-8 text-primary"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UnifiedChatInput;
