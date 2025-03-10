
import React, { useState } from 'react';
import { Calendar, Mail, MessageSquare, User, MapPin, Phone, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BookingCalendar from '@/components/BookingCalendar';
import PageHeader from '@/components/PageHeader';
import { useLeadTracking } from '@/hooks/useAnalytics';
import AnimatedText from '@/components/AnimatedText';
import { trackEvent } from '@/services/analyticsService';

const ContactSection = () => {
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
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 relative z-10">
        <PageHeader
          title="Let's Work Together"
          subtitle="Book a consultation or send me a message"
        />

        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Card - Left Column */}
            <Card className="lg:col-span-2 overflow-hidden shadow-md border-0">
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:Farzad@fbconsulting.com" className="text-white/90 hover:text-white">
                        Farzad@fbconsulting.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-white/90">+47 94446446</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-white/90">Oslo, Norway</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p className="text-white/90">Mon-Fri: 9am-5pm PST</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Form - Center Column */}
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
          </div>

          {/* Booking Calendar Section */}
          <div className="mt-16">
            <Card className="p-8 border-0 shadow-md bg-white/50">
              <div className="text-center mb-8">
                <AnimatedText
                  text="Schedule a Free Consultation"
                  tag="h2"
                  className="text-2xl font-bold mb-2"
                />
                <AnimatedText
                  text="Select a date and time that works for you"
                  tag="p"
                  delay={200}
                  className="text-muted-foreground"
                />
              </div>
              
              <div className="max-w-2xl mx-auto">
                <BookingCalendar />
              </div>
              
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <Clock size={14} />
                  All consultations are 30 minutes and completely free of charge
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
