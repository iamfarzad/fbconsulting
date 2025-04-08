
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AIMessage } from "@/services/chat/messageTypes";
import { generateMessageId } from "@/utils/messageUtils";

interface GeminiClientProps {
  children?: React.ReactNode;
  initialPrompt?: string;
  className?: string;
  apiEndpoint?: string;
  temperature?: number;
  onResponse?: (response: any) => void;
}

const GeminiClient: React.FC<GeminiClientProps> = ({
  children,
  initialPrompt = "How can I help you today?",
  className = "",
  apiEndpoint = "/api/gemini",
  temperature = 0.7,
  onResponse
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    
    // Add user message
    const userMessage: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate API response for now
      const response = "This is a test response from the simulated Gemini API.";
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create assistant message
      const assistantMessage: AIMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (onResponse) {
        onResponse(response);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Failed to get a response. Please try again.");
      
      toast({
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setInputValue("");
    }
  }, [isProcessing, onResponse, toast]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            {initialPrompt}
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted mr-auto'} max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
        
        {isProcessing && (
          <div className="bg-muted p-3 rounded-lg mr-auto max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-md"
          disabled={isProcessing}
        />
        <Button type="submit" disabled={isProcessing || !inputValue.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default GeminiClient;
