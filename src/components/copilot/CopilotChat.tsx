
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import { UnifiedChatInput } from '../ui/ai-chat/UnifiedChatInput';
import ErrorDisplay from './chat/ErrorDisplay';
import type { Message } from '../../types/message';
import { useGemini } from './providers/GeminiProvider';

interface CopilotChatProps {
  apiKey?: string;
  systemMessage?: string;
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  apiKey: propApiKey,
  systemMessage = 'You are a helpful AI assistant.',
  className = '',
}) => {
  const { toast } = useToast();
  const { sendMessage: geminiSendMessage, messages: geminiMessages, isProcessing, error: geminiError } = useGemini();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (geminiError) {
      setError(geminiError);
      toast({
        title: "Error",
        description: geminiError,
        variant: "destructive"
      });
    }
  }, [geminiError, toast]);
  
  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px] ${className}`}>
      {/* Chat header */}
      <CardHeader className="p-4 border-b">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <p className="text-sm text-muted-foreground">{geminiError ? "Error" : "Ready"}</p>
      </CardHeader>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <ChatMessages 
          messages={geminiMessages} 
          isLoading={isProcessing}
          error={error}
          messagesEndRef={messagesEndRef}
        />
      </div>
      
      {/* Error display */}
      {error && <ErrorDisplay error={error} />}
      
      {/* Input area */}
      <UnifiedChatInput 
        placeholderText="Type your message..."
        className="p-4 border-t"
        apiKey={propApiKey}
      />
    </div>
  );
};

export default CopilotChat;
