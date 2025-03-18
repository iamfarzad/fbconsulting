
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send } from "lucide-react";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  toggleListening: () => void;
  isLoading: boolean;
  isListening: boolean;
  isInitialized: boolean;
  isProviderLoading: boolean;
  isVoiceSupported: boolean;
  error: string | null;
  voiceError: string | null;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  inputValue,
  setInputValue,
  handleKeyDown,
  handleSendMessage,
  toggleListening,
  isLoading,
  isListening,
  isInitialized,
  isProviderLoading,
  isVoiceSupported,
  error,
  voiceError
}) => {
  return (
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
  );
};
