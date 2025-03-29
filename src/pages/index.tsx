
import React from 'react';
import { WebSocketChat } from '@/components/chat/WebSocketChat';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Gemini Chat Demo"
        description="Test the new multimodal chat capabilities with the Gemini API"
      />
      
      <div className="mt-4 mb-8 p-4 border border-amber-300 bg-amber-50 rounded-md">
        <h3 className="font-medium text-amber-800">IDX Team Sync Note:</h3>
        <p className="text-amber-700">
          We've updated the WebSocketChat component to support multimodal messaging! 
          You can now send both text and files (images, PDFs, etc.) through the chat interface.
          We've also fixed the glassmorphism styling issues by replacing .frosted-glass and 
          .glass-card classes with the new .glassmorphism-base class as recommended.
          The connection status indicator now properly shows the WebSocket state, and the
          component handles audio streaming correctly.
        </p>
      </div>
      
      <div className="mt-8 max-w-3xl mx-auto">
        <Card className="overflow-hidden shadow-lg">
          <WebSocketChat />
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This demo showcases the multimodal capabilities of the Gemini API.
            You can send text messages and upload files (images, PDFs, etc.) to
            get responses from the AI assistant.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Communications happen through a secure WebSocket connection with real-time audio streaming.
          </p>
        </div>
      </div>
    </div>
  );
}
