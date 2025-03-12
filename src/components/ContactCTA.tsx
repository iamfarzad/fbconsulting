
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, ArrowRight } from 'lucide-react';
import AnimatedText from './AnimatedText';
import { trackEvent } from '@/services/analyticsService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const ContactCTA = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';

  const handleBookClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'book_consultation',
      cta_location: 'contact_section',
      cta_text: 'Book a Free Consultation',
      is_norwegian: isNorwegian
    });
    navigate('/contact');
  };

  const handleContactClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'contact_me',
      cta_location: 'contact_section',
      cta_text: 'Contact Me',
      is_norwegian: isNorwegian
    });
    navigate('/contact');
  };

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal/5 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-teal/5 filter blur-3xl"></div>
        <div className="tech-grid absolute inset-0 opacity-30"></div>
      </div>
      
      <motion.div 
        className="container mx-auto max-w-5xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-glass border border-white/20">
          <div className="text-center mb-8">
            <AnimatedText
              text={isNorwegian ? "Klar til å automatisere og skalere?" : "Ready to Automate and Scale?"}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#fe5a1d] to-[#fe5a1d]/70"
            />
            <AnimatedText
              text={isNorwegian ? "La oss diskutere hvordan AI-automatisering kan transformere virksomheten din." : "Let's discuss how AI automation can transform your business."}
              tag="p"
              delay={200}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg w-full md:w-auto flex items-center gap-2 justify-center shadow-md hover:shadow-lg transition-all duration-300 group bg-[#fe5a1d] hover:bg-[#fe5a1d]/90 text-white"
              onClick={handleBookClick}
            >
              <Calendar size={20} className="text-white group-hover:scale-110 transition-transform duration-300" />
              {isNorwegian ? "Book en gratis konsultasjon" : "Book a Free Consultation"}
              <ArrowRight size={16} className="ml-1 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg w-full md:w-auto flex items-center gap-2 justify-center border-[#fe5a1d] text-[#fe5a1d] hover:bg-[#fe5a1d]/10 shadow-sm group"
              onClick={handleContactClick}
            >
              <Mail size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {isNorwegian ? "Kontakt meg" : "Contact Me"}
            </Button>
          </div>
          
          <div className="mt-8 text-center text-muted-foreground">
            <p>
              {isNorwegian ? "Ingen forpliktelser, bare en samtale om dine forretningsbehov." : "No obligations, just a conversation about your business needs."}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactCTA;
