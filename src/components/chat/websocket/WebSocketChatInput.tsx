
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Image as ImageIcon } from 'lucide-react';

interface WebSocketChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isDisabled: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WebSocketChatInput: React.FC<WebSocketChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  isDisabled,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-3 border-t">
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isDisabled}
          className="flex-1"
        />
        
        <Button
          size="icon"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled}
          title="Upload image"
        >
          <ImageIcon className="h-4 w-4" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={onFileSelect}
          />
        </Button>
        
        <Button
          size="icon"
          variant="default"
          onClick={handleSendMessage}
          disabled={isDisabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        {isDisabled ? 'Not connected. Please reload the page to try again.' : 'Connected to Gemini AI'}
      </div>
    </div>
  );
};

export default WebSocketChatInput;
