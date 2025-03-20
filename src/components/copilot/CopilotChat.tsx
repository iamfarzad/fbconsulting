
import React, { useState } from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CopilotChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const chat = useCopilotChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message to UI - using appendMessage for newer versions
    const userMessage = { role: 'user', content: inputValue };
    chat.appendMessage(userMessage as any);
    
    // Clear input
    setInputValue('');
    
    try {
      // Send message to Copilot - use appendMessage instead of appendUserMessage
      await chat.appendMessage({ 
        role: 'user', 
        content: inputValue 
      } as any);
    } catch (error) {
      console.error('Error sending message:', error);
      chat.appendMessage({ 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      } as any);
    }
  };

  return (
    <Card className="flex flex-col h-full border">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">Copilot Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {chat.messages && chat.messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default CopilotChat;
