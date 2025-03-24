import React from 'react';
import { GeminiChat } from '@/components/copilot/GeminiChat';
import PageHeader from '@/components/PageHeader';
import CopilotConfig from "@/components/copilot/core/CopilotConfig"; // Updated path

const TestMCP: React.FC = () => {
  return (
    <div className="container mx-auto py-24 px-4">
      <PageHeader 
        title="Test MCP & Gemini" 
        subtitle="Testing integration of Model Context Protocols with Google Gemini" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="h-[600px]">
          <GeminiChat />
        </div>
        <div>
          <CopilotConfig />
        </div>
      </div>
    </div>
  );
};

export default TestMCP;
