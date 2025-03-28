
import React from 'react';
import { WebSocketChat } from '@/components/chat/WebSocketChat';
import { ChatProvider } from '@/contexts/ChatContext';
import { Card } from '@/components/ui/card';

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white">
            Gemini WebSocket Chat
          </h1>
          
          <p className="text-center mt-3 text-muted-foreground max-w-lg">
            This demo uses a WebSocket connection to stream responses from Gemini AI 
            with both text and audio support.
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto p-4">
          <WebSocketChat />
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Using WebSocket API with real-time audio streaming</p>
          <p className="text-xs mt-1 opacity-70">Communications happen through a secure WebSocket connection</p>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
