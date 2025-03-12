
import React from 'react';
import { cn } from "@/lib/utils";
import { Bot, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { AIMessage } from "@/services/chat/messageTypes";
import { GraphicCardCollection } from './GraphicCardCollection';
import { EmailSummaryForm } from './EmailSummaryForm';
import { extractContentFromMessage, FormType } from '@/utils/messageExtractor';
import { NewsletterSignup } from '@/components/NewsletterSignup';

interface MessageProps {
  message: AIMessage;
  isLastMessage: boolean;
}

export const ChatMessage = ({ message, isLastMessage }: MessageProps) => {
  const isUser = message.role === 'user';
  
  // Use our utility to extract content, cards, and forms
  const { textContent, cards, forms } = extractContentFromMessage(message.content);
  
  // Helper function to render the appropriate form component
  const renderForm = (formType: FormType, formData?: Record<string, string>) => {
    switch (formType) {
      case 'email-summary':
        return <EmailSummaryForm onSubmit={handleFormSubmitted} />;
      case 'newsletter-signup':
        return <NewsletterSignup compact={true} />;
      case 'booking-request':
        // Future implementation for booking form
        return (
          <div className="p-4 bg-black/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Booking calendar will be available here soon.
            </p>
          </div>
        );
      case 'contact-form':
        // Future implementation for contact form
        return (
          <div className="p-4 bg-black/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Contact form will be available here soon.
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleFormSubmitted = () => {
    console.log('Form submitted successfully');
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
          
          {/* Render forms if present */}
          {!isUser && forms.length > 0 && (
            <div className="mt-3 space-y-3">
              {forms.map((form, index) => (
                <div key={`form-${index}`}>
                  {renderForm(form.type, form.data)}
                </div>
              ))}
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
