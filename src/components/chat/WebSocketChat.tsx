
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypingIndicator } from '@/components/ui/ai-chat/TypingIndicator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, StopCircle, Trash2 } from 'lucide-react';

export function WebSocketChat() {
  const { state, actions, error } = useChat();
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (inputValue.trim()) {
      actions.sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Chat with Gemini</span>
          {state.isConnected ? (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              <span className="text-sm text-red-600">Disconnected</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {state.messages.length > 0 ? (
            <div className="space-y-4">
              {state.messages.map((message, index) => (
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
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
          
          {state.isLoading && (
            <div className="mt-4">
              <TypingIndicator />
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t pt-4 space-x-2">
        <Input
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!state.isConnected || state.isLoading}
          className="flex-grow"
        />
        
        <Button 
          onClick={handleSend} 
          disabled={!state.isConnected || state.isLoading || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
        
        {state.isAudioPlaying ? (
          <Button variant="ghost" onClick={actions.stopAudio}>
            <StopCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" disabled>
            <Mic className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          onClick={actions.clearMessages} 
          disabled={state.messages.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
