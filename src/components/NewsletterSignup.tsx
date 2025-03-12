
import React, { useState } from 'react';
import { Mail, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { trackEvent } from '@/services/analyticsService';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean; // Add compact prop
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Subscribe to our Newsletter",
  description = "Stay up to date with the latest AI trends and insights.",
  className,
  compact = false, // Default to false
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay for demonstration purposes
    setTimeout(() => {
      // Track the lead generation event
      trackEvent({
        action: 'generate_lead',
        category: 'conversion',
        label: 'newsletter_signup',
        value: 1,
        lead_type: 'newsletter',
        lead_source: window.location.pathname,
        lead_email: email.split('@')[1], // Only tracking domain for privacy
      });
      
      // Success message
      toast.success("Thank you for subscribing!", {
        description: "You've been added to our newsletter list.",
        icon: <MailCheck className="h-4 w-4" />,
      });
      
      setEmail('');
      setIsLoading(false);
      
      // Track the newsletter signup event
      if (window.gtag) {
        window.gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: 'newsletter',
        });
      }
    }, 1500);
  };

  // If compact is true, use a more compact layout
  if (compact) {
    return (
      <div className={`w-full py-3 ${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium">{title}</h4>
          </div>
          <div className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-label="Email address"
              className="flex-grow h-9"
              // Removed the size="sm" prop that was causing the type error
            />
            <Button type="submit" disabled={isLoading} size="sm">
              {isLoading ? "..." : "Subscribe"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            By subscribing, you agree to our Privacy Policy.
          </p>
        </form>
      </div>
    );
  }

  // Regular (non-compact) version
  return (
    <div className={`w-full max-w-xl mx-auto py-6 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        
        <p className="text-muted-foreground">{description}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email address"
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
