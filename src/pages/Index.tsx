
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
import NorwegianPainPoints from '@/components/NorwegianPainPoints';
import { useLanguage } from '@/contexts/LanguageContext';
import { Faq3Demo } from '@/components/ui/faq3-demo';
import { motion } from 'framer-motion';

const Index = () => {
  console.log("Index page rendering");
  
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
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
      icon: <Bot className="size-5 text-black dark:text-white" />,
      title: t('service_ai_strategy'),
      description: t('service_ai_strategy_desc'),
      date: "Premium Service",
      className: "bg-white/90 dark:bg-black/90 backdrop-blur-sm border-[#9b87f5]/20 dark:border-[#9b87f5]/20",
      iconClassName: "bg-[#E5DEFF] dark:bg-[#9b87f5]/20 text-[#9b87f5]",
    },
    {
      icon: <MessageSquare className="size-5 text-black dark:text-white" />,
      title: t('service_chatbots'),
      description: t('service_chatbots_desc'),
      date: "Most Popular",
      className: "bg-white/90 dark:bg-black/90 backdrop-blur-sm border-teal-500/20 dark:border-teal-500/20",
      iconClassName: "bg-teal-50 dark:bg-teal-500/20 text-teal-500",
    },
    {
      icon: <Workflow className="size-5 text-black dark:text-white" />,
      title: t('service_workflow'),
      description: t('service_workflow_desc'),
      date: "High ROI",
      className: "bg-white/90 dark:bg-black/90 backdrop-blur-sm border-orange-500/20 dark:border-orange-500/20",
      iconClassName: "bg-orange-50 dark:bg-orange-500/20 text-orange-500",
    },
  ];

  return (
    <>
      <SEO
        title={isNorwegian ? "AI Automatisering for Norske Bedrifter" : "AI Automation Ally - Automate Your Business with AI"}
        description={isNorwegian 
          ? "AI-automatiseringsløsninger skreddersydd for norske bedrifter, sikrer samsvar med lokale forskrifter og adresserer spesifikke markedsbehov."
          : "Unlock the power of AI to automate your business processes, increase efficiency, and drive growth. Discover tailored AI solutions for your unique needs."}
        keywords={isNorwegian ? "AI Norge, AI automatisering Norge, GDPR samsvar, Norsk bedriftsautomatisering" : undefined}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow relative">
          {/* Global background pattern */}
          <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/5 pointer-events-none"></div>
          
          {/* Content sections */}
          <Hero />
          
          <div className="w-full py-20 bg-gradient-to-b from-gray-50/50 to-white/20 dark:from-gray-900/20 dark:to-black/30 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="absolute -top-[10%] -right-[5%] w-96 h-96 rounded-full bg-[#9b87f5]/5 blur-3xl"></div>
            <div className="absolute -bottom-[10%] -left-[5%] w-96 h-96 rounded-full bg-teal-500/5 blur-3xl"></div>
            
            <div className="container mx-auto max-w-6xl px-4 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                  {isNorwegian ? "Våre AI-Tjenester" : "Featured Services"}
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  {isNorwegian ? "Utforsk våre spesialiserte AI-løsninger designet for å automatisere og optimalisere din virksomhet" : "Explore our specialized AI solutions designed to automate and optimize your business"}
                </p>
              </motion.div>
              
              <DisplayCards cards={featuredServices} />
            </div>
          </div>
          
          {/* Conditionally show Norwegian pain points for Norwegian language */}
          <NorwegianPainPoints isVisible={isNorwegian} />
          
          {/* Show standard pain points for everyone */}
          <PainPoints />
          <ServicesList />
          <WhyWorkWithMe />
          <Testimonials />
          
          {/* FAQ Section */}
          <div id="faq">
            <Faq3Demo />
          </div>
          
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
