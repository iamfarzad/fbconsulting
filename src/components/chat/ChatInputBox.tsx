import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  textareaRef
}) => {
  return (
    <TextareaAutosize
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      minRows={1}
      maxRows={5}
      className={cn(
        'w-full px-4 py-3 resize-none bg-transparent',
        'focus:outline-none focus:ring-0',
        'text-base placeholder:text-muted-foreground',
        'disabled:opacity-50'
      )}
    />
  );
};
