
import React from 'react';
import { cn } from "@/lib/utils";
import { Bot, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { AIMessage } from "@/services/copilotService";

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
        "p-3 rounded-lg mb-3 max-w-[80%]",
        isUser 
          ? "ml-auto bg-teal text-deep-purple" 
          : "mr-auto bg-deep-purple text-neon-white"
      )}
    >
      <div className="flex items-start gap-2">
        {!isUser && (
          <div className="p-1.5 bg-deep-purple/50 rounded-full mt-0.5">
            <Bot size={16} className="text-teal" />
          </div>
        )}
        <div>
          <p className={isUser ? "text-deep-purple" : "text-neon-white"}>
            {message.content}
          </p>
          <div className={cn(
            "text-xs mt-1",
            isUser ? "text-deep-purple/70" : "text-neon-white/70"
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        {isUser && (
          <div className="p-1.5 bg-teal/30 rounded-full mt-0.5">
            <CircleUserRound size={16} className="text-deep-purple" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
