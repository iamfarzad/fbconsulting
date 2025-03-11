
import React, { useState } from 'react';
import { Mail, MessageSquare, User, ArrowRight, Briefcase, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useLeadTracking } from '@/hooks/useAnalytics';
import { services } from '@/data/servicesData';

const ContactForm = () => {
  const { toast } = useToast();
  const { trackLead } = useLeadTracking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, service: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });

    trackLead('contact_form', {
      form_location: 'contact_page',
      email_domain: formData.email.split('@')[1],
      selected_service: formData.service,
    });
    
    setFormData({ name: '', email: '', service: '', message: '' });
  };

  return (
    <Card className="p-8 shadow-md border-0 bg-white/50 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Send a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground/80">
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
            <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
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
        </div>

        <div className="space-y-2">
          <label htmlFor="service" className="block text-sm font-medium text-foreground/80">
            Service Interest
          </label>
          <Select 
            value={formData.service} 
            onValueChange={handleServiceChange}
          >
            <SelectTrigger id="service" className="w-full pl-10 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Briefcase size={18} />
              </div>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service, index) => (
                <SelectItem key={index} value={service.title}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground/80">
            Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none text-muted-foreground">
              <MessageSquare size={18} />
            </div>
            <Textarea 
              id="message" 
              placeholder="How can I help with your AI automation needs?"
              className="pl-10 min-h-[150px] resize-none"
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 justify-center rounded-md"
        >
          Send Message
          <ArrowRight size={16} />
        </Button>
      </form>
    </Card>
  );
};

export default ContactForm;
