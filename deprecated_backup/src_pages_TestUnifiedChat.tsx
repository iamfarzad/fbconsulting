
import React from 'react';
import { UnifiedChat } from '@/components/chat/UnifiedChat';
import { UnifiedFullScreenChat } from '@/components/chat/UnifiedFullScreenChat';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';

/**
 * Test page for the unified chat components
 */
const TestUnifiedChat: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Test Unified Chat</h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Display Mode:</h2>
          <Button 
            variant={!isFullScreen ? "default" : "outline"}
            onClick={() => setIsFullScreen(false)}
          >
            Inline
          </Button>
          <Button 
            variant={isFullScreen ? "default" : "outline"}
            onClick={() => setIsFullScreen(true)}
          >
            Full Screen
          </Button>
        </div>
      </div>
      
      <ChatProvider>
        <div className="border rounded-lg p-4 bg-card">
          {isFullScreen ? (
            <UnifiedFullScreenChat 
              onMinimize={() => setIsFullScreen(false)}
              placeholderText="Ask me anything about our AI services..."
            />
          ) : (
            <div className="h-[600px]">
              <UnifiedChat
                onToggleFullScreen={() => setIsFullScreen(true)}
                placeholderText="Ask me anything about our AI services..."
                className="h-full"
              />
            </div>
          )}
        </div>
      </ChatProvider>
    </div>
  );
};

export default TestUnifiedChat;
