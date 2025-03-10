
"use client";

import React, { useState } from "react";
import { ChatInput } from "./ai-chat/ChatInput";
import { ChatMessageList } from "./ai-chat/ChatMessageList";
import { useMessages } from "@/hooks/useMessages";
import { useSuggestedResponse } from "@/hooks/useSuggestedResponse";
import { LeadInfo } from "@/services/copilotService";

interface AIChatInputProps {
  placeholderText?: string;
}

export function AIChatInput({ placeholderText = "Ask me anything..." }: AIChatInputProps) {
  const [showMessages, setShowMessages] = useState(false);
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a mock LeadInfo object for suggestions with correct type structure
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery' // Using a valid property from LeadInfo
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    try {
      addUserMessage(inputValue);
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      addAssistantMessage("This is a mock response. Replace with actual AI response logic.");
    } finally {
      setIsLoading(false);
    }
    
    setInputValue("");
    
    // Show messages container when first message is sent
    if (!showMessages) {
      setShowMessages(true);
    }
  };

  const handleClear = () => {
    clearMessages();
    setShowMessages(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Messages Container - conditionally rendered */}
      {(showMessages || messages.length > 0) && (
        <ChatMessageList 
          messages={messages} 
          showMessages={showMessages} 
        />
      )}
      
      {/* Input Container */}
      <ChatInput
        value={inputValue}
        setValue={setInputValue}
        onSend={handleSend}
        onClear={handleClear}
        isLoading={isLoading}
        showMessages={showMessages}
        hasMessages={messages.length > 0}
        suggestedResponse={suggestedResponse}
        placeholder={placeholderText}
      />
    </div>
  );
}

export default AIChatInput;
