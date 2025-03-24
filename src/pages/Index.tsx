import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SEO from '@/components/SEO';
import { usePageViewTracking } from '@/hooks/useAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { Faq3 } from "@/components/ui/faq3";
import ContactCTA from '@/components/ContactCTA';
import AboutHero from '@/components/about/AboutHero';
import GlobalImpact from '@/components/about/GlobalImpact';
import BackgroundExperience from '@/components/about/BackgroundExperience';
import SkillsTechnologies from '@/components/about/SkillsTechnologies';
import AIJourney from '@/components/about/AIJourney';
import { getPersonStructuredData } from '@/components/about/AboutStructuredData';
import Testimonials from '@/components/testimonials/Testimonials';
import { getHomePageStructuredData } from '@/services/blog';

const Index = () => {
  console.log("Index page rendering");
  
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
  usePageViewTracking("AI Automation Ally - Home");

  useEffect(() => {
    console.log("Index page effect running");
    
    // Safer DOM manipulation with requestAnimationFrame to ensure document is ready
    const applyPageTransitionClasses = () => {
      if (document && document.body) {
        document.body.classList.remove('page-enter');
        document.body.classList.add('page-enter-active');
      }
    };
    
    // Schedule DOM manipulation for next frame
    const animationFrame = requestAnimationFrame(applyPageTransitionClasses);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      // Cleanup in a safe way
      if (document && document.body) {
        document.body.classList.remove('page-enter-active');
        document.body.classList.add('page-enter');
      }
    };
  }, []);

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
  };

  const personStructuredData = getPersonStructuredData();
  const homePageStructuredData = getHomePageStructuredData(isNorwegian);
  
  // Combine all structured data for the home page
  const combinedStructuredData = [
    personStructuredData,
    homePageStructuredData
  ];

  return (
    <>
      <SEO
        title={isNorwegian ? "AI Automatisering for Norske Bedrifter | F.B Consulting" : "AI Automation Ally - Automate Your Business with AI | F.B Consulting"}
        description={isNorwegian 
          ? "AI-automatiseringsløsninger skreddersydd for norske bedrifter, sikrer samsvar med lokale forskrifter og adresserer spesifikke markedsbehov. Øk effektiviteten og reduser kostnader med AI."
          : "Unlock the power of AI to automate your business processes, increase efficiency, and drive growth. Expert AI consulting services for workflow optimization and cost reduction."}
        keywords={isNorwegian 
          ? "AI Norge, AI automatisering Norge, GDPR samsvar, Norsk bedriftsautomatisering, virksomhetsautomatisering, AI konsulent Oslo" 
          : "AI automation, business process automation, AI consulting, workflow optimization, cost reduction, AI implementation"}
        language={isNorwegian ? "no" : "en"}
        structuredData={combinedStructuredData}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow relative">
          {/* Global background pattern */}
          <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/5 pointer-events-none"></div>
          
          {/* Hero Section */}
          <header>
            <Hero />
          </header>
          
          {/* About section with semantic HTML5 tags */}
          <section id="about" aria-labelledby="about-heading" className="relative z-10">
            <h2 id="about-heading" className="sr-only">About</h2>
            <AboutHero />
            <GlobalImpact />
            <AIJourney />
            <BackgroundExperience />
            <SkillsTechnologies />
          </section>
          
          {/* Testimonials */}
          <section id="testimonials" aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="sr-only">Testimonials</h2>
            <Testimonials />
          </section>
          
          {/* FAQ Section */}
          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="sr-only">Frequently Asked Questions</h2>
            <Faq3 {...faqData} />
          </section>
          
          {/* Contact CTA */}
          <section id="contact-cta" aria-labelledby="contact-cta-heading">
            <h2 id="contact-cta-heading" className="sr-only">Contact Us</h2>
            <ContactCTA />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
