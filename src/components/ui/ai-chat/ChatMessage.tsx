
import React from 'react';
import { cn } from "@/lib/utils";
import { Bot, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { AIMessage } from "@/services/chat/messageTypes";
import { GraphicCardCollection } from './GraphicCardCollection';
import { CardType } from './GraphicCard';
import { EmailSummaryForm } from './EmailSummaryForm';

interface MessageProps {
  message: AIMessage;
  isLastMessage: boolean;
}

export const ChatMessage = ({ message, isLastMessage }: MessageProps) => {
  const isUser = message.role === 'user';
  
  // Check if message contains card data
  const hasCards = message.content.includes('[[CARD:');
  
  // Check if message contains form data
  const hasEmailSummaryForm = message.content.includes('[[FORM:email-summary]]');
  
  // Extract card data if present
  const extractCards = (content: string): { 
    textContent: string, 
    cards: Array<{ type: CardType; title: string; description: string }> 
  } => {
    const cards: Array<{ type: CardType; title: string; description: string }> = [];
    let textContent = content;
    
    // Extract card data from message content
    const cardRegex = /\[\[CARD:(\w+):([^:]+):([^\]]+)\]\]/g;
    let match;
    
    while ((match = cardRegex.exec(content)) !== null) {
      const type = match[1] as CardType;
      const title = match[2];
      const description = match[3];
      
      cards.push({ type, title, description });
      
      // Remove the card data from the text content
      textContent = textContent.replace(match[0], '');
    }
    
    return { textContent: textContent.trim(), cards };
  };
  
  const { textContent, cards } = hasCards ? extractCards(message.content) : { textContent: message.content.replace(/\[\[FORM:email-summary\]\]/g, '').trim(), cards: [] };
  
  const handleFormSubmitted = () => {
    console.log('Email summary form submitted');
  };
  
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
            {textContent}
          </p>
          
          {/* Render cards if present */}
          {cards.length > 0 && (
            <div className="mt-3">
              <GraphicCardCollection cards={cards} />
            </div>
          )}
          
          {/* Render email summary form if present */}
          {hasEmailSummaryForm && !isUser && (
            <div className="mt-3">
              <EmailSummaryForm onSubmit={handleFormSubmitted} />
            </div>
          )}
          
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
