
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '../types';

interface GeminiChatProps {
  apiKey?: string;
  className?: string;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({
  apiKey,
  className = '',
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMessage: Message = {
        role: 'user',
        content: inputValue.trim(),
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Simple mock response for now
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'This is a placeholder response from the Gemini API. The actual integration will be implemented soon.',
          timestamp: Date.now()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle>Gemini Chat</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto p-4 flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted self-start'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="p-2 rounded-lg bg-muted self-start">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t flex">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            className="ml-2"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiChat;
