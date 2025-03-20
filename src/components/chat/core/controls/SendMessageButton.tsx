
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface SendMessageButtonProps {
  hasContent: boolean;
  isLoading: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const SendMessageButton: React.FC<SendMessageButtonProps> = ({
  hasContent,
  isLoading,
  onClick,
  disabled,
}) => {
  return (
    <Button
      type="submit"
      size="icon"
      variant={hasContent ? "default" : "ghost"}
      onClick={onClick}
      className={cn(
        'rounded-full w-8 h-8',
        !hasContent && 'text-muted-foreground'
      )}
      disabled={(!hasContent && !disabled) || isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
};
