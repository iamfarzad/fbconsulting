
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCopilot } from "@/hooks/useCopilot";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/services/analyticsService";
import { ChatMessageList } from "./ai-chat/ChatMessageList";
import { ChatInput } from "./ai-chat/ChatInput";
import { QuickActions } from "./ai-chat/QuickActions";

interface AIChatInputProps {
  inlineMessages?: boolean;
  placeholderText?: string;
}

export function AIChatInput({ 
  inlineMessages = false, 
  placeholderText = "Ask about AI automation for your business..." 
}: AIChatInputProps) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [showMessages, setShowMessages] = useState(false);
  
  const { 
    messages, 
    sendMessage, 
    clearMessages, 
    isLoading, 
    leadInfo,
    suggestedResponse,
    currentPersona 
  } = useCopilot();
  
  const handleSendMessage = async () => {
    if (!value.trim() || isLoading) return;
    
    const message = value.trim();
    setValue("");
    setShowMessages(true);
    
    await sendMessage(message);
  };
  
  // Auto scroll to ensure the chat is visible when messages appear
  useEffect(() => {
    if (messages.length > 0 && showMessages) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const chatElement = document.querySelector('.message-list-container');
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length, showMessages]);
  
  const handleActionClick = (topic: string) => {
    const actionMessages = {
      'Chatbots': "I'm interested in implementing AI chatbots for my business. What options do you offer?",
      'Workflow Automation': "I'd like to automate our workflow processes to save time. How can AI help with that?",
      'AI Strategy': "I need help developing an AI strategy for my business. Where should I start?",
      'Content Generation': "Can you tell me more about AI content generation and how it can help my business?",
      'Data Analysis': "I'm looking to gain better insights from our business data. How can AI analytics help?"
    };
    
    setValue(actionMessages[topic as keyof typeof actionMessages]);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    
    // Track navigation
    trackEvent({
      action: 'chat_navigation',
      category: 'navigation',
      label: path,
      source: 'chatbot'
    });
  };
  
  // Define the persona-based placeholder texts
  const placeholdersByPersona = {
    strategist: "Ask about AI strategy and transformation...",
    technical: "Ask about technical implementation and integration...",
    consultant: "Ask about specific services and solutions...",
    general: "Ask about AI automation for your business..."
  };

  const currentPlaceholder = placeholdersByPersona[currentPersona] || placeholderText;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {(showMessages || messages.length > 0) && (
        <div className="message-list-container">
          <ChatMessageList 
            messages={messages}
            showMessages={showMessages}
          />
        </div>
      )}
      
      <ChatInput
        value={value}
        setValue={setValue}
        onSend={handleSendMessage}
        onClear={clearMessages}
        isLoading={isLoading}
        showMessages={showMessages}
        hasMessages={messages.length > 0}
        suggestedResponse={suggestedResponse}
        placeholder={currentPlaceholder}
      />

      <QuickActions onActionClick={handleActionClick} />
      
      {leadInfo.stage === 'ready-to-book' && (
        <div className="mt-4 text-center">
          <Button 
            variant="default" 
            className="rounded-full"
            onClick={() => handleNavigate('/contact')}
          >
            Book a Consultation
          </Button>
        </div>
      )}
    </div>
  );
}
