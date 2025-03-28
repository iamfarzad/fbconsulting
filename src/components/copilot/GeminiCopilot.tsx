
import React, { useState } from 'react';
import { useGeminiCopilot } from './GeminiCopilotProvider';

interface GeminiCopilotProps {
  className?: string;
}

const GeminiCopilot: React.FC<GeminiCopilotProps> = ({ className = '' }) => {
  const { 
    messages, 
    sendMessage, 
    isLoading 
  } = useGeminiCopilot();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 mb-4 border rounded-md bg-background/5">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation with the AI assistant</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={message.id || index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted mr-12'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border rounded-md bg-background">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[80px] p-3 bg-background border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 self-end"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiCopilot;
