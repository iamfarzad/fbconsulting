import React from 'react';
import { GeminiCopilotProvider } from '@/components/copilot/GeminiCopilotProvider';
import { GeminiCopilot } from '@/components/copilot/GeminiCopilot';

const CopilotDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Gemini Copilot Demo</h1>
          <p className="text-muted-foreground">
            Explore our AI-powered business assistant with voice capabilities
          </p>
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <GeminiCopilotProvider>
              <GeminiCopilot className="min-h-[600px]" />
            </GeminiCopilotProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CopilotDemo;
