import React, { useRef } from 'react';
import { Card, CardHeader } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import ErrorDisplay from './chat/ErrorDisplay';
import { useGemini } from './providers/GeminiProvider';

interface CopilotChatProps {
  apiKey?: string;
  systemMessage?: string;
  className?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({
  className = ''
}) => {
  const { toast } = useToast();
  const { 
    sendMessage,
    messages,
    isProcessing,
    error
  } = useGemini();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    try {
      await sendMessage({
        type: 'text_message',
        text: inputValue.trim(),
        enableTTS: true
      });
      setInputValue('');
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`rounded-lg border shadow-sm overflow-hidden flex flex-col h-[600px] ${className}`}>
      <CardHeader className="p-4 border-b">
        <ChatHeader
          title="AI Assistant"
          subtitle={error ? "Error" : "Ready"}
        />
      </CardHeader>

      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <ChatMessages
          messages={messages}
          isLoading={isProcessing}
          error={error}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {error && <ErrorDisplay error={error} />}

      <div className="border-t p-4 flex gap-2">
        <Textarea
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[44px] max-h-32"
          rows={1}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isProcessing}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CopilotChat;
