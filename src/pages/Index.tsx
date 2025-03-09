
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PainPoints from '@/components/PainPoints';
import ServicesList from '@/components/ServicesList';
import WhyWorkWithMe from '@/components/WhyWorkWithMe';
import Testimonials from '@/components/testimonials/Testimonials';
import ContactCTA from '@/components/ContactCTA';
import SEO from '@/components/SEO';
import { usePageViewTracking } from '@/hooks/useAnalytics';

const Index = () => {
  console.log("Index page rendering");
  
  usePageViewTracking("AI Automation Ally - Home");

  useEffect(() => {
    console.log("Index page effect running");
    document.body.classList.add('page-enter-active');
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  return (
    <div className="page-enter">
      <SEO
        title="AI Automation Ally - Automate Your Business with AI"
        description="Unlock the power of AI to automate your business processes, increase efficiency, and drive growth. Discover tailored AI solutions for your unique needs."
      />
      <Navbar />
      <Hero />
      <PainPoints />
      <ServicesList />
      <WhyWorkWithMe />
      <Testimonials />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default Index;
