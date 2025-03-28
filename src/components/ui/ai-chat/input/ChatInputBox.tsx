
import React from 'react';

interface ChatInputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled?: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  textareaRef
}) => {
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="w-full py-3 px-4 resize-none max-h-60 bg-transparent border-0 focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50"
        style={{ 
          overflowY: 'auto'
        }}
      />
    </div>
  );
};
