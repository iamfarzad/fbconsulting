
"use client";

import React, { useState } from "react";
import { ChatInput } from "./ai-chat/ChatInput";
import { ChatMessageList } from "./ai-chat/ChatMessageList";
import { useMessages } from "@/hooks/useMessages";
import { useSuggestedResponse } from "@/hooks/useSuggestedResponse";

interface AIChatInputProps {
  placeholderText?: string;
}

export function AIChatInput({ placeholderText = "Ask me anything..." }: AIChatInputProps) {
  const [showMessages, setShowMessages] = useState(false);
  const { messages, addMessage, clearMessages, isLoading } = useMessages();
  const { suggestedResponse } = useSuggestedResponse(messages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue);
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
