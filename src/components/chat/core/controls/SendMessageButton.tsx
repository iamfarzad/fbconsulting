
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SendMessageButtonProps {
  onClick: () => void;
  disabled?: boolean;
  hasContent?: boolean;
  isLoading?: boolean;
  aiProcessing?: boolean;
}

export const SendMessageButton: React.FC<SendMessageButtonProps> = ({ 
  onClick, 
  disabled = false,
  hasContent = false,
  isLoading = false,
  aiProcessing = false
}) => {
  const isProcessing = isLoading || aiProcessing;
  
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={onClick}
      disabled={disabled || isProcessing || !hasContent}
      className="h-8 w-8 text-primary"
      aria-label="Send message"
    >
      <Send className="h-4 w-4" />
    </Button>
  );
};

export default SendMessageButton;
