
import React from 'react';
import { WebSocketChat } from '@/components/chat/WebSocketChat';
import { PageHeader } from '@/components/ui/page-header';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Gemini Chat Demo"
        description="Test the new multimodal chat capabilities with the Gemini API"
      />
      
      <div className="mt-8 max-w-3xl mx-auto">
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <WebSocketChat />
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This demo showcases the new multimodal capabilities of the Gemini API.
            You can send text messages and the AI will respond. In the future,
            you'll be able to send images and other media types as well.
          </p>
        </div>
      </div>
    </div>
  );
}
