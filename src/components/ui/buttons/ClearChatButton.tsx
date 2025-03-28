
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ClearChatButtonProps {
  onClick: () => void;
}

export const ClearChatButton: React.FC<ClearChatButtonProps> = ({
  onClick
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2 w-full text-xs text-muted-foreground"
      onClick={onClick}
    >
      <Trash2 className="h-3 w-3 mr-1" />
      Clear Chat
    </Button>
  );
};

export default ClearChatButton;
