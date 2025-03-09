
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
import { Bot, MessageSquare, Workflow } from 'lucide-react';

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

  // Featured services cards data
  const featuredServices = [
    {
      icon: <Bot className="size-4 text-teal" />,
      title: "AI Strategy",
      description: "Custom roadmaps for your business",
      date: "Premium Service",
      iconClassName: "text-teal",
      titleClassName: "text-teal",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <MessageSquare className="size-4 text-retro-pink" />,
      title: "AI Chatbots",
      description: "24/7 Customer Support",
      date: "Most Popular",
      iconClassName: "text-retro-pink",
      titleClassName: "text-retro-pink",
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Workflow className="size-4 text-neon-blue" />,
      title: "Workflow Automation",
      description: "Streamline your business processes",
      date: "High ROI",
      iconClassName: "text-neon-blue",
      titleClassName: "text-neon-blue",
      className:
        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <>
      <SEO
        title="AI Automation Ally - Automate Your Business with AI"
        description="Unlock the power of AI to automate your business processes, increase efficiency, and drive growth. Discover tailored AI solutions for your unique needs."
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Hero />
          <div className="w-full py-16 bg-gradient-to-r from-deep-purple/10 to-background">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient-retro">Featured Services</h2>
              <DisplayCards cards={featuredServices} />
            </div>
          </div>
          <PainPoints />
          <ServicesList />
          <WhyWorkWithMe />
          <Testimonials />
          <ContactCTA />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
