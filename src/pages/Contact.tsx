
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, MessageSquare, User, ArrowRight } from 'lucide-react';
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
import ContactSection from '@/components/contact/ContactSection';

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
        description="Schedule a free consultation to discuss your business automation needs or send me a message to learn more about my AI automation services."
        structuredData={contactStructuredData}
      />
      
      <Navbar />
      
      <main className="flex-grow relative overflow-hidden">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
        
        {/* Main Contact Section */}
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
