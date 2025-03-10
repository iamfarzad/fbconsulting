
import React, { useState } from 'react';
import { Mail, MessageSquare, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLeadTracking } from '@/hooks/useAnalytics';

const ContactForm = () => {
  const { toast } = useToast();
  const { trackLead } = useLeadTracking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally submit to an API
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });

    // Track the contact form submission as a lead
    trackLead('contact_form', {
      form_location: 'contact_page',
      email_domain: formData.email.split('@')[1], // Only tracking domain for privacy
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Card className="lg:col-span-3 p-8 shadow-md border-0">
      <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <User size={18} />
            </div>
            <Input 
              id="name" 
              placeholder="John Doe" 
              className="pl-10" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Mail size={18} />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="your.email@example.com" 
              className="pl-10" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-muted-foreground">
              <MessageSquare size={18} />
            </div>
            <Textarea 
              id="message" 
              placeholder="How can I help with your AI automation needs?"
              className="pl-10 min-h-[150px]"
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 rounded-md">
          Send Message
          <ArrowRight size={16} />
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
