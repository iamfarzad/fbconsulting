
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat';
import LocationGreeting from './LocationGreeting';
import { Flag, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { AnimatedGridPattern } from './ui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/services/analyticsService';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const isNorwegian = language === 'no';
  const navigate = useNavigate();
  
  const handleConsultationClick = () => {
    trackEvent({
      action: 'click',
      category: 'cta',
      label: 'hero_consultation',
      cta_location: 'hero',
      cta_text: 'Book Free Consultation'
    });
    
    navigate('/contact');
  };
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
    >
      {/* Animated Grid Pattern Background - Now Tilted */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={4}
        repeatDelay={1}
        className={cn(
          "opacity-70 dark:opacity-50",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12", // Added skew for tilt effect
          "z-0"
        )}
      />
      
      <div className="container mx-auto max-w-4xl relative z-10 mt-10 md:mt-0">
        <div className="absolute top-0 right-0 md:right-4 flex items-center gap-3">
          <LanguageSwitcher variant="dropdown" />
        </div>
        
        <div className="text-center mb-6">
          <LocationGreeting className="mb-2 text-muted-foreground" />
        </div>
        
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-8">
          {isNorwegian && (
            <motion.div 
              className="bg-gradient-to-r from-red-600/10 to-blue-600/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2 border border-white/10 animate-flag-wave"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Flag className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">{t('norway_focused')}</span>
            </motion.div>
          )}
          
          <motion.h1 
            className="text-4xl md:text-5xl font-semibold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isNorwegian ? (
              <span className="relative">
                {t('norway_title')}
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-blue-600 opacity-80"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                ></motion.span>
              </span>
            ) : "How can AI automation help your business?"}
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground text-center max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isNorwegian ? t('hero_subtitle') : "Ask me anything about AI automation, workflow optimization, or how to reduce costs with intelligent systems"}
          </motion.p>
          
          <motion.div 
            className="w-full relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AIChatInput autoFullScreen={false} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mt-4"
          >
            <Button 
              size="lg" 
              onClick={handleConsultationClick}
              className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group bg-[#fe5a1d] hover:bg-[#fe5a1d]/90 text-white"
            >
              <Calendar className="mr-2 h-5 w-5 text-white group-hover:scale-110 transition-all duration-300" />
              Book Free Consultation
              <ArrowRight className="ml-2 h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Simplified scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-9 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-foreground/40"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
