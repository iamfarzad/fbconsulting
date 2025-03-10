
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BookingCalendar from '@/components/BookingCalendar';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import { useLeadTracking } from '@/hooks/useAnalytics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DotPattern from '@/components/ui/dot-pattern';

const Contact = () => {
  const { toast } = useToast();
  const { trackLead } = useLeadTracking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

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

  // Local business structured data
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "F.B Consulting",
    "description": "Expert AI automation consulting services",
    "url": window.location.origin,
    "email": "hello@farzadbayat.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Contact & Book a Consultation | F.B Consulting"
        description="Schedule a free consultation to discuss your business automation needs or send a message to learn more about our AI automation services."
        structuredData={contactStructuredData}
      />
      
      <Navbar />
      
      <main className="flex-grow pt-28 pb-12 relative">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
        <div className="container mx-auto px-4 relative z-10">
          <PageHeader
            title="Let's Work Together"
            subtitle="Book a consultation or send me a message"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Contact Form */}
            <Card className="p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <User size={18} />
                    </div>
                    <Input 
                      id="name" 
                      placeholder="Your Name" 
                      className="pl-10" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
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
                      placeholder="How can I help you?"
                      className="pl-10 min-h-[120px]"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Booking Calendar */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Book a Consultation</h2>
              <Card className="p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <Calendar size={18} />
                  <span>Select a date & time for your consultation</span>
                </div>
                <BookingCalendar />
                <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <Clock size={16} />
                  <span>All consultations are 30 minutes and in your local timezone</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Additional Contact Information */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold mb-4">Prefer email?</h3>
            <p className="text-muted-foreground">
              You can reach me directly at <a href="mailto:hello@farzadbayat.com" className="text-teal font-medium hover:underline">hello@farzadbayat.com</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
