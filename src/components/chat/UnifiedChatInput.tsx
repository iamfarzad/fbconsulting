import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface UnifiedChatInputProps {
  placeholder?: string;
  className?: string;
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  placeholder = 'Type your message...',
  className
}) => {
  const { state, dispatch, sendMessage } = useChat();
  const { inputValue, isLoading } = state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    try {
      await sendMessage(inputValue);
      dispatch({ type: 'SET_INPUT_VALUE', payload: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => dispatch({ type: 'SET_INPUT_VALUE', payload: e.target.value })}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          'w-full rounded-lg border bg-background px-4 py-2',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      />
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2',
          'p-2 rounded-lg bg-primary text-primary-foreground',
          'hover:bg-primary/90 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
      >
        Send
      </button>
    </form>
  );
};
