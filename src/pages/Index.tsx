
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
import { Faq3 } from "@/components/ui/faq3";
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
      icon: <Bot className="size-5 text-purple-600" />,
      title: t('service_ai_strategy'),
      description: t('service_ai_strategy_desc'),
      date: t('premium_service'),
      className: "border-purple-500/20",
      iconClassName: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      icon: <MessageSquare className="size-5 text-teal-600" />,
      title: t('service_chatbots'),
      description: t('service_chatbots_desc'),
      date: t('most_popular'),
      className: "border-teal-500/20",
      iconClassName: "bg-teal-50 dark:bg-teal-500/10",
    },
    {
      icon: <Workflow className="size-5 text-orange-600" />,
      title: t('service_workflow'),
      description: t('service_workflow_desc'),
      date: t('high_roi'),
      className: "border-orange-500/20",
      iconClassName: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  // FAQ data
  const faqData = {
    heading: isNorwegian ? "Ofte stilte spørsmål" : "Frequently asked questions",
    description: isNorwegian 
      ? "Alt du trenger å vite om våre AI-tjenester. Finner du ikke svaret du leter etter? Ta gjerne kontakt med vårt supportteam."
      : "Everything you need to know about our AI services. Can't find the answer you're looking for? Feel free to contact our support team.",
    items: [
      {
        id: "faq-1",
        question: isNorwegian ? "Hvilke AI-tjenester tilbyr dere?" : "What AI services do you offer?",
        answer: isNorwegian
          ? "Vi tilbyr et bredt spekter av AI-tjenester inkludert chatbots, virtuelle assistenter, arbeidsflytautomatisering, AI-strategirådgivning og spesialtilpasset AI-utvikling skreddersydd for din bedrifts behov."
          : "We offer a wide range of AI services including chatbots, virtual assistants, workflow automation, AI strategy consulting, and custom AI development tailored to your business needs.",
      },
      {
        id: "faq-2",
        question: isNorwegian ? "Hvordan kan AI-automatisering gagne min bedrift?" : "How can AI automation benefit my business?",
        answer: isNorwegian
          ? "AI-automatisering kan betydelig redusere manuelle prosesser, minimere menneskelige feil, forbedre kundeservice, forbedre beslutningsprosesser med datainnsikt, og til slutt øke operasjonell effektivitet og inntekt."
          : "AI automation can significantly reduce manual processes, minimize human error, improve customer service, enhance decision-making with data insights, and ultimately increase operational efficiency and revenue.",
      },
      {
        id: "faq-3",
        question: isNorwegian ? "Er AI-implementering dyrt?" : "Is AI implementation expensive?",
        answer: isNorwegian
          ? "Kostnader for AI-implementering varierer basert på dine spesifikke behov. Vi tilbyr fleksible prisplaner som passer for bedrifter i alle størrelser, med fokus på løsninger som gir målbar ROI og rask verdi."
          : "AI implementation costs vary based on your specific needs. We offer flexible pricing plans suitable for businesses of all sizes, focusing on solutions that provide measurable ROI and quick time-to-value.",
      },
      {
        id: "faq-4",
        question: isNorwegian ? "Hvor lang tid tar det å implementere AI-løsninger?" : "How long does it take to implement AI solutions?",
        answer: isNorwegian
          ? "Implementeringstider avhenger av kompleksiteten i dine behov. Enkle chatbots kan rulles ut på noen uker, mens omfattende arbeidsflytautomatisering kan ta 2-3 måneder. Vi gir klare tidslinjer under vår innledende konsultasjon."
          : "Implementation timelines depend on the complexity of your needs. Simple chatbots can be deployed in a few weeks, while comprehensive workflow automation might take 2-3 months. We provide clear timelines during our initial consultation.",
      },
      {
        id: "faq-5",
        question: isNorwegian ? "Tilbyr dere støtte etter implementering?" : "Do you offer support after implementation?",
        answer: isNorwegian
          ? "Ja, vi tilbyr kontinuerlig støtte og vedlikehold for alle våre AI-løsninger. Våre støttepakker inkluderer regelmessige oppdateringer, ytelsesovervåking og teknisk hjelp for å sikre at AI-systemene dine fortsetter å yte optimalt."
          : "Yes, we provide ongoing support and maintenance for all our AI solutions. Our support packages include regular updates, performance monitoring, and technical assistance to ensure your AI systems continue to perform optimally.",
      },
    ],
    supportHeading: isNorwegian ? "Har du fortsatt spørsmål?" : "Still have questions?",
    supportDescription: isNorwegian
      ? "Våre AI-spesialister er klare til å hjelpe deg med å finne den perfekte automatiseringsløsningen for din bedrift. Ta kontakt for en gratis konsultasjon."
      : "Our AI specialists are ready to help you find the perfect automation solution for your business. Get in touch for a free consultation.",
    supportButtonText: isNorwegian ? "Kontakt Vårt Team" : "Contact Our Team",
    supportButtonUrl: "/contact",
  };

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
          
          <section className="w-full py-20 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="absolute -top-[10%] -right-[5%] w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
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
          </section>
          
          {/* Conditionally show Norwegian pain points for Norwegian language */}
          <NorwegianPainPoints isVisible={isNorwegian} />
          
          {/* Show standard pain points for everyone */}
          <PainPoints />
          <ServicesList />
          <WhyWorkWithMe />
          <Testimonials />
          
          {/* FAQ Section */}
          <div id="faq">
            <Faq3 {...faqData} />
          </div>
          
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
