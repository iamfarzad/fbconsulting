
import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { AIMessage } from "@/services/copilotService";
import { ChatMessage } from "./ChatMessage";

interface ChatMessageListProps {
  messages: AIMessage[];
  showMessages: boolean;
}

export const ChatMessageList = ({ messages, showMessages }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!showMessages && messages.length === 0) {
    return null;
  }

  return (
    <div className="bg-black rounded-t-xl border border-white/30 p-4 overflow-y-auto max-h-[400px] min-h-[200px]">
      <AnimatePresence>
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center py-10"
          >
            <Bot size={40} className="text-white mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">
              How can I help with your AI automation needs?
            </h3>
            <p className="text-white/70 max-w-lg">
              Ask me anything about implementing AI in your business, from chatbots to 
              workflow automation and strategic planning.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index} 
                message={msg} 
                isLastMessage={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
