
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeroContent } from './hero/HeroContent';
import { HeroBackground } from './hero/HeroBackground';
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const [chatInputValue, setChatInputValue] = useState('');
  
  const handleInputChange = (value: string) => {
    setChatInputValue(value);
  };
  
  return (
    <GeminiProvider>
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
      >
        <HeroBackground />
        
        <HeroContent 
          chatInputValue={chatInputValue}
          onInputChange={handleInputChange}
        />
      </section>
    </GeminiProvider>
  );
};

export default Hero;
