
import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/useMessages';
import { trackEvent } from '@/services/analyticsService';

interface EmailSummaryFormProps {
  onSubmit: () => void;
}

export const EmailSummaryForm: React.FC<EmailSummaryFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { messages } = useMessages();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Create summary of messages
    const summary = messages
      .map((msg) => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content.replace(/\[\[CARD:[^\]]+\]\]/g, '')}`)
      .join('\n\n');
    
    // Simulate sending email (in a real app, this would call an API endpoint)
    setTimeout(() => {
      // Track event
      trackEvent({
        action: 'email_summary_requested',
        category: 'conversion',
        label: 'chat_summary',
        email_domain: email.split('@')[1],
      });
      
      toast({
        title: "Summary sent!",
        description: `We've sent a summary of this conversation to ${email}`,
      });
      
      setIsLoading(false);
      onSubmit();
    }, 1500);
  };
  
  return (
    <div className="bg-black/5 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">Get a summary of this conversation</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-grow"
          required
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Send
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-2">
        We'll send you a copy of this conversation and never spam you.
      </p>
    </div>
  );
};
