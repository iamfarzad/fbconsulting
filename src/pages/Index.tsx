
import React from 'react';
import { UnifiedChat } from '@/components/chat/UnifiedChat';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Gemini AI Assistant</h1>
      
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-center mb-8">
          This AI-powered assistant helps with questions about our services, products, and more.
        </p>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <UnifiedChat 
            title="Gemini AI Assistant"
            subtitle="Powered by Google Gemini"
            placeholderText="Ask me anything about our services..."
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
