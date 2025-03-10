
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ContactCTA from '@/components/ContactCTA';
import Testimonials from '@/components/testimonials/Testimonials';
import Pricing from '@/components/Pricing';
import SEO from '@/components/SEO';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesContent from '@/components/services/ServicesContent';

const Services = () => {
  console.log("Services page rendering");
  
  useEffect(() => {
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    // Handle scroll to hash element on page load
    const handleHashScroll = () => {
      const hash = window.location.hash;
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
  }, []);
  
  // Structured data for SEO
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
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Chatbots & Virtual Assistants",
        "description": "Implement intelligent AI assistants that can handle customer inquiries, support requests, and internal knowledge management.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "Workflow Automation",
        "description": "Connect your applications and systems to eliminate manual data entry, reduce errors, and streamline operations.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 4,
        "name": "AI Data Insights",
        "description": "Transform your raw business data into actionable intelligence through automated analysis and reporting.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      },
      {
        "@type": "Service",
        "position": 5,
        "name": "Custom AI Development",
        "description": "Tailored solutions for your unique business challenges using cutting-edge AI technologies.",
        "provider": {
          "@type": "ProfessionalService",
          "name": "AI Automation Ally"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="AI Automation Services | Business Process Optimization"
        description="Explore our specialized AI automation services: strategy consulting, chatbots, workflow automation, data insights, and custom AI development for businesses."
        structuredData={servicesStructuredData}
      />
      
      <Navbar />
      
      <ServicesHero />
      
      <ServicesContent />
      
      <Pricing />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Services;
