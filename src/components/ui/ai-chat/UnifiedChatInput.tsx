
import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { cn } from '@/lib/utils';

interface UnifiedChatInputProps {
  placeholderText?: string;
  className?: string;
  apiKey?: string;
  onSend?: (message: string, files?: any[]) => void;
}

export const UnifiedChatInput: React.FC<UnifiedChatInputProps> = ({
  placeholderText = "Type your message...",
  className,
  apiKey,
  onSend
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { sendMessage, isProcessing } = useGemini();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Adjust height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;
    
    if (onSend) {
      onSend(inputValue, []);
    } else {
      sendMessage({ type: 'text_message', text: inputValue });
    }
    
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would connect to speech recognition APIs
    if (!isRecording) {
      console.log('Started recording');
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue(prev => prev + " Voice input simulation");
        console.log('Stopped recording');
      }, 2000);
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-end border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-background p-2">
        <Textarea
          ref={textareaRef}
          placeholder={isRecording ? "Listening..." : placeholderText}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none border-0 p-2 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[200px]"
          disabled={isProcessing || isRecording}
        />
        
        <div className="flex items-center px-2 gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => {}}
            disabled={isProcessing || isRecording}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isRecording ? "text-destructive bg-destructive/10" : "text-muted-foreground"
            )}
            onClick={toggleVoiceRecording}
            disabled={isProcessing}
          >
            <Mic className="h-4 w-4" />
            <span className="sr-only">
              {isRecording ? "Stop voice recording" : "Start voice recording"}
            </span>
          </Button>
          
          <Button
            type="button"
            variant="default"
            size="icon"
            className="h-8 w-8"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChatInput;
