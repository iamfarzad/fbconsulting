
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  textareaRef,
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full resize-none appearance-none overflow-hidden",
          "bg-transparent border-0 p-3",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[60px] max-h-[200px]",
          "text-base"
        )}
        rows={1}
      />
    </div>
  );
};

export default ChatInputBox;
