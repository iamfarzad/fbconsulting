
import React from 'react';
import { Calendar, Clock, Mail, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import BookingCalendar from '@/components/BookingCalendar';
import PageHeader from '@/components/PageHeader';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally submit to an API
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
  };

  return (
    <div className="container mx-auto py-24 px-4 md:px-6">
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
                <Input id="name" placeholder="Your Name" className="pl-10" required />
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
                <Input id="email" type="email" placeholder="your.email@example.com" className="pl-10" required />
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
          You can reach me directly at <a href="mailto:contact@aiautomationally.com" className="text-primary font-medium hover:underline">contact@aiautomationally.com</a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
