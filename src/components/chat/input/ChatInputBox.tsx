
import React, { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  className?: string;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  textareaRef,
  className
}) => {
  return (
    <Textarea 
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={cn(
        'w-full px-4 py-3',
        'resize-none',
        'bg-transparent',
        'border-none',
        'text-black/90 dark:text-white/90 text-sm',
        'focus:outline-none',
        'focus-visible:ring-0 focus-visible:ring-offset-0',
        'placeholder:text-black/50 dark:placeholder:text-white/50 placeholder:text-sm',
        'min-h-[60px] rounded-2xl',
        className
      )}
      style={{ overflow: 'hidden' }}
      disabled={disabled}
    />
  );
};
