
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';
import { useGeminiChat } from '@/hooks/useGeminiChat';

export const GeminiChat: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { personaData } = usePersonaManagement();
  const { messages, isLoading, appendMessage } = useGeminiChat({ personaData });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      appendMessage({
        role: "user",
        content: inputValue
      });
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const currentPersona = personaData.personaDefinitions[personaData.currentPersona];
  
  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-medium text-sm">AI Assistant - {currentPersona.name}</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : message.role === 'error'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex">
          <Textarea
            className="flex-1 min-h-[80px] resize-none border rounded-l-md p-3 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
          <Button 
            className="rounded-l-none" 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
