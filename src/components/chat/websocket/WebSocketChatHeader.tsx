
import React from 'react';
import { Button } from '@/components/ui/button';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketChatHeaderProps {
  status: ConnectionStatus;
  onClearChat: () => void;
  messagesCount: number;
  isProcessing: boolean;
}

export const WebSocketChatHeader: React.FC<WebSocketChatHeaderProps> = ({
  status,
  onClearChat,
  messagesCount,
  isProcessing
}) => {
  return (
    <div className="p-3 border-b flex items-center justify-between bg-card">
      <div>
        <h3 className="font-semibold">Gemini Chat</h3>
        <div className="text-xs flex items-center gap-1.5">
          <div 
            className={`w-2 h-2 rounded-full ${
              status === 'connected' ? 'bg-green-500' : 
              status === 'connecting' ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
          />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClearChat}
        disabled={messagesCount === 0 || isProcessing}
      >
        Clear Chat
      </Button>
    </div>
  );
};

export default WebSocketChatHeader;
