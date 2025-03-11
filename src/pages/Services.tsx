
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import Testimonials from '@/components/testimonials/Testimonials';
import Pricing from '@/components/Pricing';
import SEO from '@/components/SEO';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesContent from '@/components/services/ServicesContent';
import { useLocation } from 'react-router-dom';
import PainPoints from '@/components/PainPoints';
import ServicesList from '@/components/ServicesList';
import WhyWorkWithMe from '@/components/WhyWorkWithMe';
import NorwegianPainPoints from '@/components/NorwegianPainPoints';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  console.log("Services page rendering");
  const location = useLocation();
  const { language } = useLanguage();
  const isNorwegian = language === 'no';
  
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    // Handle scroll to hash element on page load
    const handleHashScroll = () => {
      const hash = location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500); // Slight delay to ensure elements are rendered
      }
    };
    
    handleHashScroll();
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, [location.hash]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="AI Automation Services | F.B Consulting"
        description="Explore our specialized AI automation services: strategy consulting, chatbots, workflow automation, data insights, and custom AI development for businesses."
        structuredData={servicesStructuredData}
      />
      
      <Navbar />
      
      <ServicesHero />
      
      {/* Conditionally show Norwegian pain points for Norwegian language */}
      <NorwegianPainPoints isVisible={isNorwegian} />
      
      {/* Show standard pain points for everyone */}
      <PainPoints />
      
      {/* Display the services offerings in a bento grid layout */}
      <ServicesList />
      
      {/* Show detailed information about each service */}
      <ServicesContent />
      
      <WhyWorkWithMe />
      
      <div id="pricing">
        <Pricing />
      </div>
      
      <div id="testimonials">
        <Testimonials />
      </div>
      
      <ContactCTA />
      <Footer />
    </div>
  );
};

// Move structured data to a separate constant
const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Service",
      "position": 1,
      "name": "AI Strategy & Consulting",
      "description": "Get a customized roadmap for integrating AI into your business operations, with clear implementation steps and ROI projections.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting"
      }
    },
    {
      "@type": "Service",
      "position": 2,
      "name": "Chatbots & Virtual Assistants",
      "description": "Implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting"
      }
    },
    {
      "@type": "Service",
      "position": 3,
      "name": "Workflow Automation",
      "description": "Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting"
      }
    },
    {
      "@type": "Service",
      "position": 4,
      "name": "AI Data Insights",
      "description": "Transform your raw business data into actionable intelligence through automated analysis and reporting.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting"
      }
    },
    {
      "@type": "Service",
      "position": 5,
      "name": "Custom AI Development",
      "description": "Tailored solutions for your unique business challenges using cutting-edge AI technologies.",
      "provider": {
        "@type": "ProfessionalService",
        "name": "F.B Consulting"
      }
    }
  ]
};

export default Services;
