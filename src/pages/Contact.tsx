
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DotPattern from '@/components/ui/dot-pattern';
import ContactSection from '@/components/contact/ContactSection';

const Contact = () => {
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  // Local business structured data
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "F.B Consulting",
    "description": "Expert AI automation consulting services",
    "url": window.location.origin,
    "email": "Farzad@fbconsulting.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+47 94446446",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Oslo",
      "addressCountry": "Norway"
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
