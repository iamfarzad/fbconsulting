
import React, { useState } from 'react';
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { useCopilotChat } from "@copilotkit/react-core";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';

export const CopilotChat: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const chat = useCopilotChat();
  const { personaData } = usePersonaManagement();
  
  const handleSendMessage = () => {
    if (inputValue.trim() && !chat.isLoading) {
      chat.appendMessage({
        content: inputValue,
        role: "user"
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
        {chat.messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {chat.isLoading && (
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
      </div>
      
      <div className="border-t p-4">
        <div className="flex">
          <CopilotTextarea
            className="flex-1 min-h-[80px] resize-none border rounded-l-md p-3 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            autosuggestionsConfig={{
              count: 3
            }}
          />
          <Button 
            className="rounded-l-none" 
            onClick={handleSendMessage} 
            disabled={chat.isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
