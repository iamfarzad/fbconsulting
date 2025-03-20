
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCopilotChat } from '@copilotkit/react-core';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CopilotChatProps {
  initialMessages?: Message[];
  apiConfig?: {
    apiKey: string;
    endpoint?: string;
    modelName?: string;
  };
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  initialMessages = [],
  apiConfig,
  className
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { sendMessage, isLoading } = useCopilotChat();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to the chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send message to CopilotKit
      const response = await sendMessage(input);
      
      // Add assistant response
      const assistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Clear input
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, there was an error processing your request.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className={`copilot-chat-container flex flex-col h-full ${className || ''}`}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="copilot-chat-messages space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`copilot-chat-message p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary/10 ml-auto max-w-[80%]' 
                    : 'bg-muted mr-auto max-w-[80%]'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-2 items-center text-sm text-muted-foreground p-3">
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CopilotChat;
