
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
          We've fixed build errors in the WebSocketChat component and implemented proper
          integration with the Gemini API through WebSockets. The connection status indicator now
          properly shows the WebSocket connection state, and error handling has been improved.
          Audio streaming via the backend also works correctly. Next steps: improving the UI and 
          adding support for multimodal messaging (images/documents).
        </p>
      </div>
      
      <div className="mt-8 max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <WebSocketChat />
        </Card>
        
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
