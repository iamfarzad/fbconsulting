
import React from 'react';
import { cn } from '@/lib/utils';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';
import HeroAnimation from './hero/HeroAnimation';
import ScrollIndicator from './hero/ScrollIndicator';
import LanguageSwitcher from '../LanguageSwitcher';

interface ServicesHeroProps {
  className?: string;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ className }) => {
  return (
    <section className={cn("relative py-20 overflow-hidden", className)}>
      <HeroBackground />
      
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="absolute top-0 right-4 z-20">
          <LanguageSwitcher variant="dropdown" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <HeroContent />
          <HeroAnimation />
        </div>
        
        <ScrollIndicator />
      </div>
    </section>
  );
};

export default ServicesHero;
