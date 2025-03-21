import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { MessageMedia } from '@/services/chat/messageTypes';
import { MessageMedia as MessageMediaComponent } from './MessageMedia';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  isLoading?: boolean;
  avatarUrl?: string;
  userName?: string;
  timestamp?: number;
  isError?: boolean;
  media?: MessageMedia[];
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  isLoading = false,
  avatarUrl,
  userName,
  timestamp,
  isError = false,
  media = [],
  className,
}) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';
  const isSystem = role === 'system';
  
<<<<<<< HEAD
  // Format timestamp
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
=======
  const { textContent, cards, forms } = extractContentFromMessage(message.content);
  const { media } = extractMediaContent(textContent);
  
  const renderForm = (formType: FormType, formData?: Record<string, string>) => {
    switch (formType) {
      case 'email-summary':
        return <EmailSummaryForm onSubmit={handleFormSubmitted} />;
      case 'newsletter-signup':
        return <NewsletterSignup compact={true} />;
      case 'booking-request':
        return (
          <div className="p-4 bg-black/5 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Booking calendar will be available here soon.
            </p>
          </div>
        );
      case 'contact-form':
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
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
  
  return (
    <div 
      className={cn(
        "flex gap-3 p-4",
        isUser ? "justify-end" : "justify-start",
        isError && "opacity-75",
        className
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 rounded-full">
          <img 
            src={avatarUrl || "/avatar-ai.png"} 
            alt={userName || "AI"} 
            className="rounded-full object-cover" 
          />
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
          isSystem && "bg-muted text-muted-foreground text-sm italic",
          isError && "bg-destructive/10 text-destructive dark:bg-destructive/20"
        )}>
          {/* Message content */}
          {content}
          
          {/* Loading indicator */}
          {isLoading && (
            <span className="inline-block ml-1">
              <span className="animate-ping">.</span>
              <span className="animate-ping animation-delay-200">.</span>
              <span className="animate-ping animation-delay-400">.</span>
            </span>
          )}
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <div className="text-xs text-muted-foreground mt-1">
            {formattedTime}
          </div>
        )}
<<<<<<< HEAD
        
        {/* Media content */}
        {media && media.length > 0 && (
          <MessageMediaComponent media={media} className="mt-2" />
=======
        <div>
          <p className={isUser ? "text-black" : "text-white"}>
            {textContent}
          </p>
          
          {media.length > 0 && (
            <div className="space-y-2 mt-2">
              {media.map((item, index) => (
                <MessageMedia 
                  key={`media-${index}`} 
                  media={item}
                />
              ))}
            </div>
          )}
          
          {cards.length > 0 && (
            <div className="mt-3">
              <GraphicCardCollection cards={cards} />
            </div>
          )}
          
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
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-full">
          <img 
            src={avatarUrl || "/avatar-user.png"} 
            alt={userName || "You"} 
            className="rounded-full object-cover" 
          />
        </Avatar>
      )}
    </div>
  );
};
