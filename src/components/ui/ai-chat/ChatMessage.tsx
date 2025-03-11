
import React from 'react';
import { cn } from "@/lib/utils";
import { Bot, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { AIMessage } from "@/services/chat/messageTypes";

interface MessageProps {
  message: AIMessage;
  isLastMessage: boolean;
}

export const ChatMessage = ({ message, isLastMessage }: MessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "p-3 rounded-xl mb-3 max-w-[80%]",
        isUser 
          ? "ml-auto bg-white text-black" 
          : "mr-auto bg-black text-white"
      )}
    >
      <div className="flex items-start gap-2">
        {!isUser && (
          <div className="p-1.5 bg-black/50 rounded-full mt-0.5">
            <Bot size={16} className="text-white" />
          </div>
        )}
        <div>
          <p className={isUser ? "text-black" : "text-white"}>
            {message.content}
          </p>
          <div className={cn(
            "text-xs mt-1",
            isUser ? "text-black/70" : "text-white/70"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        {isUser && (
          <div className="p-1.5 bg-white/30 rounded-full mt-0.5">
            <CircleUserRound size={16} className="text-black" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
