/**
 * UnifiedChat Component
 * A unified chat interface that works with both CopilotKit and custom chat services
 */

import React from 'react';
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { useUnifiedChat } from '@/hooks/useUnifiedChat';
import { Button } from "@/components/ui/button";
import { Send, Expand, Minimize, Trash } from "lucide-react";
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { AnimatePresence, motion } from 'framer-motion';

interface UnifiedChatProps {
  useCopilotKit?: boolean;
  fullScreen?: boolean;
  onToggleFullScreen?: () => void;
  placeholderText?: string;
  className?: string;
}

export const UnifiedChat: React.FC<UnifiedChatProps> = ({
  useCopilotKit = true,
  fullScreen = false,
  onToggleFullScreen,
  placeholderText = "Ask me anything...",
  className = ""
}) => {
  const {
    showMessages,
    messages,
    isLoading,
    inputValue,
    setInputValue,
    suggestedResponse,
    containerRef,
    handleSend,
    handleClear
  } = useUnifiedChat({ useCopilotKit });
  
  // Use try-catch to handle potential errors with the persona management
  let personaData;
  try {
    const personaResult = usePersonaManagement();
    personaData = personaResult?.personaData;
  } catch (error) {
    console.error('Error with persona management:', error);
    // Provide a default persona
    personaData = {
      currentPersona: 'general',
      personaDefinitions: {
        general: {
          name: 'AI Assistant',
          description: 'General assistant',
          tone: 'Friendly',
          focusAreas: ['General assistance'],
          samplePhrases: ['How can I help?']
        }
      }
    };
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSuggestedResponseClick = () => {
    if (suggestedResponse) {
      setInputValue(suggestedResponse);
    }
  };
  
  // Safely access the current persona with fallbacks
  const currentPersona = personaData?.personaDefinitions?.[personaData?.currentPersona] || {
    name: 'AI Assistant',
    description: 'General assistant',
    tone: 'Friendly',
    focusAreas: ['General assistance'],
    samplePhrases: ['How can I help?']
  };
  
  return (
    <div 
      className={`flex flex-col bg-background border rounded-lg shadow-sm ${fullScreen ? 'h-full' : 'h-[500px]'} ${className}`}
      ref={containerRef}
    >
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-medium text-sm">AI Assistant - {currentPersona.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClear}
            title="Clear chat"
          >
            <Trash size={16} />
          </Button>
          {onToggleFullScreen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleFullScreen}
              title={fullScreen ? "Minimize" : "Expand"}
            >
              {fullScreen ? <Minimize size={16} /> : <Expand size={16} />}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.filter(msg => msg.role !== 'system').map((message, index) => (
            <motion.div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="max-w-[80%] p-3 rounded-lg bg-muted">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {suggestedResponse && (
        <div className="px-4 py-2 border-t">
          <button
            onClick={handleSuggestedResponseClick}
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            Suggested: "{suggestedResponse}"
          </button>
        </div>
      )}
      
      <div className="border-t p-4">
        <div className="flex">
          <CopilotTextarea
            className="flex-1 min-h-[80px] resize-none border rounded-l-md p-3 focus:outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            autosuggestionsConfig={{} as any}
          />
          <Button 
            className="rounded-l-none" 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChat;
