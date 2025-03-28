
import React from 'react';
import { WebSocketChat } from '@/components/chat/WebSocketChat';
import { ChatProvider } from '@/contexts/ChatContext';

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Gemini WebSocket Chat</h1>
        
        <p className="text-center mb-8">
          This demo uses the updated WebSocket backend documented in BACKEND_UPDATE_NOTES.md
        </p>
        
        <div className="max-w-lg mx-auto">
          <WebSocketChat />
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Using WebSocket API with audio support</p>
          <p>All communications happen through a secure WebSocket connection</p>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
