import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import PainPoints from '@/components/PainPoints';
import ServicesList from '@/components/ServicesList';
import Testimonials from '@/components/testimonials/Testimonials';
import WhyWorkWithMe from '@/components/WhyWorkWithMe';
import Pricing from '@/components/Pricing';
import ClassesSection from '@/components/classes/ClassesSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="AI Automation Consulting | F.B Consulting"
        description="I help businesses automate and grow with AI. Expert in strategy, chatbots, workflow automation, and custom AI solutions."
      />

      <Navbar />
      
      <Hero />
      <PainPoints />
      <ServicesList />
      <ClassesSection />
      
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

export default Index;
