
"use client";

import React, { useState } from "react";
import { ChatInput } from "./ai-chat/ChatInput";
import { ChatMessageList } from "./ai-chat/ChatMessageList";
import { useMessages } from "@/hooks/useMessages";
import { useSuggestedResponse } from "@/hooks/useSuggestedResponse";
import { LeadInfo } from "@/services/copilotService";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AIChatInputProps {
  placeholderText?: string;
}

export function AIChatInput({ placeholderText = "Ask me anything..." }: AIChatInputProps) {
  const [showMessages, setShowMessages] = useState(false);
  const { messages, addUserMessage, addAssistantMessage, clearMessages } = useMessages();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Create a mock LeadInfo object for suggestions with correct type structure
  const mockLeadInfo: LeadInfo = {
    interests: messages.map(m => m.content),
    stage: 'discovery' // Using a valid property from LeadInfo
  };
  
  const suggestedResponse = useSuggestedResponse(mockLeadInfo);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Message is empty",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      addUserMessage(inputValue);
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      addAssistantMessage("This is a mock response. Replace with actual AI response logic.");
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
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
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="flex flex-col w-full max-h-[80vh] relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Messages Container with fixed height and scroll */}
        <AnimatePresence mode="wait">
          {(showMessages || messages.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", maxHeight: "60vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="will-change-scroll"
              style={{ scrollbarGutter: "stable" }}
            >
              <ChatMessageList 
                messages={messages} 
                showMessages={showMessages} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input Container with shadow transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            boxShadow: showMessages ? "0 -4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
          }}
          transition={{ delay: 0.2 }}
          className="relative z-10 bg-background"
        >
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIChatInput;
