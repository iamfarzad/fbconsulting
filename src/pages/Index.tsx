
import React from 'react';
import { Card } from '@/components/ui/card';
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider';
import { CopilotChat } from '@/components/copilot/CopilotChat';

const Index: React.FC = () => {
  return (
    <GeminiProvider>
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white">
            Gemini AI Assistant
          </h1>
          
          <p className="text-center mt-3 text-muted-foreground max-w-lg">
            Experience real-time conversation with Gemini AI featuring text and voice interactions.
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CopilotChat />
        </Card>
      </div>
    </GeminiProvider>
  );
};

export default Index;
