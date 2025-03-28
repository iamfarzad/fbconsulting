
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypingIndicator } from '@/components/ui/ai-chat/TypingIndicator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Trash2, Volume, VolumeX, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '@/components/chat/core/ConnectionStatus';

export function WebSocketChat() {
  const { state, actions, error, clientId } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);
  
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
    <div className="flex flex-col h-[600px]">
      <div className="border-b pb-2">
        <div className="flex justify-between items-center p-4">
          <CardTitle className="text-xl">Chat with Gemini</CardTitle>
          <div className="flex items-center space-x-2">
            <ConnectionStatus 
              isConnected={state.isConnected} 
              isLoading={!state.isInitialized} 
            />
            <span className="text-xs text-muted-foreground">ID: {clientId.substring(0, 8)}</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-grow p-4">
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
                
                {/* Audio indicator for assistant messages */}
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
                    {state.isAudioPlaying && index === state.messages.length - 1 ? (
                      <div className="flex items-center">
                        <Volume className="h-3 w-3 mr-1" />
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${state.audioProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
            <p>No messages yet. Start a conversation!</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={actions.connect}
              disabled={state.isConnected}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Connect
            </Button>
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
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={actions.connect}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reconnect
            </Button>
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-4 space-x-2 flex">
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
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
        
        {state.isAudioPlaying ? (
          <Button variant="outline" size="icon" onClick={actions.stopAudio}>
            <VolumeX className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" disabled={true}>
            <Mic className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={actions.clearMessages} 
          disabled={state.messages.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
