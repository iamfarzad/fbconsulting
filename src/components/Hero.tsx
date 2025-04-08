
import { useRef } from 'react';
import { HeroContent } from './hero/HeroContent';
import { HeroBackground } from './hero/HeroBackground';
import { GeminiProvider } from '@/components/copilot/providers/GeminiProvider';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  return (
    <GeminiProvider>
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
      >
        <HeroBackground />
        
        <HeroContent />
      </section>
    </GeminiProvider>
  );
};

export default Hero;
