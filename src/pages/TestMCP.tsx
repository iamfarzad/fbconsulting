
import React from 'react';
import { CopilotChat } from '@/components/copilot/CopilotChat';
import { PageHeader } from '@/components/PageHeader';
import { CopilotConfig } from '@/components/copilot/CopilotConfig';

const TestMCP: React.FC = () => {
  return (
    <div className="container mx-auto py-24 px-4">
      <PageHeader 
        title="Test MCP & CopilotKit" 
        subtitle="Testing integration of Model Context Protocols with CopilotKit" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="h-[600px]">
          <CopilotChat />
        </div>
        <div>
          <CopilotConfig />
        </div>
      </div>
    </div>
  );
};

export default TestMCP;
