
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  className,
  textareaRef,
  ...props
}) => {
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex-1 resize-none border-0 bg-transparent p-3 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] max-h-[200px]",
        className
      )}
      rows={1}
      {...props}
    />
  );
};

export default ChatInputBox;
