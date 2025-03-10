
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
import DisplayCards from '@/components/ui/display-cards';
import DotPattern from '@/components/ui/dot-pattern';
import { Bot, MessageSquare, Workflow } from 'lucide-react';

const Index = () => {
  console.log("Index page rendering");
  
  usePageViewTracking("AI Automation Ally - Home");

  useEffect(() => {
    console.log("Index page effect running");
    // Remove previous class first if exists
    document.body.classList.remove('page-enter');
    document.body.classList.add('page-enter-active');
    
    return () => {
      document.body.classList.remove('page-enter-active');
      document.body.classList.add('page-enter');
    };
  }, []);

  // Featured services cards data
  const featuredServices = [
    {
      icon: <Bot className="size-4 text-black dark:text-white" />,
      title: "AI Strategy",
      description: "Custom roadmaps for your business",
      date: "Premium Service",
      className: "bg-white dark:bg-black hover:-translate-y-1 transition-transform duration-300",
    },
    {
      icon: <MessageSquare className="size-4 text-black dark:text-white" />,
      title: "AI Chatbots",
      description: "24/7 Customer Support",
      date: "Most Popular",
      className: "bg-white dark:bg-black hover:-translate-y-1 transition-transform duration-300",
    },
    {
      icon: <Workflow className="size-4 text-black dark:text-white" />,
      title: "Workflow Automation",
      description: "Streamline your business processes",
      date: "High ROI",
      className: "bg-white dark:bg-black hover:-translate-y-1 transition-transform duration-300",
    },
  ];

  return (
    <>
      <SEO
        title="AI Automation Ally - Automate Your Business with AI"
        description="Unlock the power of AI to automate your business processes, increase efficiency, and drive growth. Discover tailored AI solutions for your unique needs."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow relative">
          {/* Global background pattern */}
          <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/5 pointer-events-none"></div>
          
          {/* Content sections */}
          <Hero />
          
          <div className="w-full py-16 bg-gray-50 dark:bg-gray-900/20 relative">
            <div className="container mx-auto max-w-6xl px-4 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black dark:text-white">Featured Services</h2>
              <DisplayCards cards={featuredServices} />
            </div>
          </div>
          
          <PainPoints />
          <ServicesList />
          <WhyWorkWithMe />
          <Testimonials />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
