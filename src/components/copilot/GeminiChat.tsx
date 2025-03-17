
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, X, Mic } from "lucide-react";
import { useGemini } from './GeminiProvider';
import useGeminiChat from '@/hooks/useGeminiChat';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { AnimatedBars } from '../ui/AnimatedBars';

export const GeminiChat: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { personaData, isInitialized, isLoading: isProviderLoading, error: providerError } = useGemini();
  const { messages, isLoading, error, sendMessage, clearMessages } = useGeminiChat({ personaData });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice input integration
  const {
    isListening,
    transcript,
    toggleListening,
    voiceError,
    isVoiceSupported
  } = useVoiceInput(setInputValue, () => {
    if (inputValue.trim()) {
      handleSendMessage();
    }
  });
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Default persona name if not available
  const currentPersonaName = personaData?.personaDefinitions[personaData?.currentPersona]?.name || "AI Assistant";
  
  return (
    <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-medium text-sm">
            {currentPersonaName}
            {isProviderLoading && <span className="ml-2 text-muted-foreground">(Initializing...)</span>}
          </h3>
        </div>
        
        {messages.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearMessages}
            className="h-8 px-2 text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            <span className="text-xs">Clear</span>
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading or error states */}
        {providerError && (
          <div className="p-4 bg-destructive/10 rounded-lg text-destructive text-sm">
            <p className="font-medium">Error initializing AI Assistant</p>
            <p className="mt-1">{providerError}</p>
            <p className="mt-2 text-xs">Please check your API key configuration.</p>
          </div>
        )}
        
        {isProviderLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">
                Initializing AI Assistant...
              </p>
            </div>
          </div>
        )}
        
        {/* No messages state */}
        {!isProviderLoading && isInitialized && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              No messages yet. Start a conversation!
            </p>
          </div>
        )}
        
        {/* Messages */}
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
              
              {/* Timestamp */}
              <div className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
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
        
        {/* Voice transcript indicator */}
        {isListening && transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-3 rounded-lg bg-primary/20 text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <AnimatedBars isActive={true} small={true} />
                <div className="whitespace-pre-wrap">{transcript}</div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex">
          <Textarea
            className="flex-1 min-h-[60px] max-h-[120px] resize-none border rounded-l-md p-3 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask me anything..."}
            disabled={isLoading || isListening || !isInitialized || isProviderLoading}
          />
          
          <div className="flex flex-col">
            {isVoiceSupported && (
              <Button 
                variant="outline"
                size="icon"
                onClick={toggleListening}
                disabled={isLoading || !isInitialized || isProviderLoading}
                className={`rounded-none border-y border-r h-1/2 ${isListening ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Mic size={18} />
              </Button>
            )}
            
            <Button 
              className="rounded-none rounded-tr-md border border-l-0 h-1/2" 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim() || !isInitialized || isProviderLoading}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
        
        {/* Display voice error */}
        {voiceError && (
          <p className="mt-2 text-xs text-destructive">{voiceError}</p>
        )}
        
        {/* API error */}
        {error && !voiceError && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
};

export default GeminiChat;
