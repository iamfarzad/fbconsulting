
import React from 'react';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  id: string;
}

interface WebSocketChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const WebSocketChatMessages: React.FC<WebSocketChatMessagesProps> = ({
  messages,
  isProcessing,
  messagesEndRef
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Send a message to start chatting with Gemini AI
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))
      )}
      
      {isProcessing && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2 rounded-lg bg-muted">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default WebSocketChatMessages;
