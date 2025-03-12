
import React, { useState, useEffect } from 'react';
import { Mail, Send, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/useMessages';
import { trackEvent } from '@/services/analyticsService';
import {
  sendEmailSummary,
  loadEmailPreference,
  EmailSummaryOptions,
  formatSummary
} from '@/services/emailService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface EmailSummaryFormProps {
  onSubmit: () => void;
}

export const EmailSummaryForm: React.FC<EmailSummaryFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<EmailSummaryOptions>({
    includeTimestamps: false,
    includeMetadata: false,
    format: 'plain'
  });
  const { toast } = useToast();
  const { messages } = useMessages();

  // Load saved email preference
  useEffect(() => {
    const savedPreference = loadEmailPreference();
    if (savedPreference) {
      setEmail(savedPreference.email);
      setOptions(savedPreference.options);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format summary with options
      const summary = formatSummary(messages, options);
      
      // Send email
      const result = await sendEmailSummary(email, summary, options);
      
      if (!result.success) {
        toast({
          title: "Error sending email",
          description: result.error || "Failed to send email summary",
          variant: "destructive",
        });
        return;
      }

      // Track event
      trackEvent({
        action: 'email_summary_sent',
        category: 'conversion',
        label: 'chat_summary',
        email_domain: email.split('@')[1],
      });

      toast({
        title: "Summary sent!",
        description: `We've sent a summary of this conversation to ${email}`,
      });

      onSubmit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/5 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium">Get a summary of this conversation</h3>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Summary Options</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamps"
                    checked={options.includeTimestamps}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, includeTimestamps: checked === true }))
                    }
                  />
                  <Label htmlFor="timestamps">Include timestamps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metadata"
                    checked={options.includeMetadata}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, includeMetadata: checked === true }))
                    }
                  />
                  <Label htmlFor="metadata">Include metadata</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-grow"
          required
          pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address (e.g., example@domain.com)"
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
