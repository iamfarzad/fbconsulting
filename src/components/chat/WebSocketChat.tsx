
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypingIndicator } from '@/components/ui/ai-chat/TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Trash2, Volume, VolumeX, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '@/components/chat/core/ConnectionStatus';
import { Card } from '@/components/ui/card';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
}

export function WebSocketChat() {
  const { state, actions, error } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [offlineMode, setOfflineMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Detect if the WebSocket connection fails repeatedly
  useEffect(() => {
    let failedAttempts = 0;
    
    const checkOfflineMode = () => {
      if (!state.isConnected && error) {
        failedAttempts++;
        if (failedAttempts >= 3) {
          setOfflineMode(true);
        }
      } else {
        failedAttempts = 0;
        setOfflineMode(false);
      }
    };
    
    checkOfflineMode();
    
    // Set up an interval to check connection status
    const intervalId = setInterval(checkOfflineMode, 10000);
    
    return () => clearInterval(intervalId);
  }, [state.isConnected, error]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);
  
  const handleSend = () => {
    if (inputValue.trim()) {
      if (offlineMode) {
        // In offline mode, provide a mock response
        actions.sendMessage(inputValue);
        setTimeout(() => {
          const mockResponses = [
            "I'm currently offline. Your message has been saved and I'll respond when connection is restored.",
            "Sorry, I can't connect to the AI service right now. Please try again later.",
            "It seems we're having connectivity issues. I've noted your message and will get back to you soon."
          ];
          const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
          console.log("Sending mock response in offline mode:", randomResponse);
        }, 1000);
      } else {
        actions.sendMessage(inputValue);
      }
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
          <h2 className="text-xl font-semibold">Chat with Gemini</h2>
          <div className="flex items-center space-x-2">
            <ConnectionStatus 
              isConnected={state.isConnected} 
              isLoading={!state.isInitialized} 
            />
            <span className="text-xs text-muted-foreground">ID: {state.clientId.substring(0, 8)}</span>
          </div>
        </div>
      </div>
      
      {offlineMode && (
        <Card className="m-4 p-3 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-amber-800">
              Offline Mode: Limited functionality available. The AI assistant will provide basic responses.
            </p>
          </div>
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => {
              setOfflineMode(false);
              actions.connect();
            }}
            className="mt-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try to reconnect
          </Button>
        </Card>
      )}
      
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
        
        {error && !offlineMode && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800">
            <p className="font-medium">Connection Error</p>
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
          placeholder={offlineMode ? "Offline mode - limited responses available" : "Type a message..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={(!offlineMode && !state.isConnected) || state.isLoading}
          className="flex-grow"
        />
        
        <Button 
          onClick={handleSend} 
          disabled={(!offlineMode && !state.isConnected) || state.isLoading || !inputValue.trim()}
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
