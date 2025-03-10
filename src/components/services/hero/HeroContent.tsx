
import React from 'react';
import AnimatedText from '@/components/AnimatedText';
import HeroBadge from './HeroBadge';
import HeroActions from './HeroActions';

const HeroContent = () => {
  return (
    <div className="lg:col-span-7">
      <HeroBadge />
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-futuristic mb-6 leading-tight">
        <AnimatedText 
          text="Transform Your Business" 
          className="text-white block" 
          tag="span"
        />
        <AnimatedText 
          text="With Intelligent" 
          className="text-white block" 
          tag="span"
          delay={100}
        />
        <AnimatedText 
          text="Automation" 
          className="text-white/90 block" 
          tag="span"
          delay={200}
        />
      </h1>
      
      <p className="text-xl text-white/80 mb-8 max-w-xl opacity-0 animate-fade-in-up" 
         style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        We build custom AI solutions that automate repetitive tasks, enhance decision-making, and drive efficiency across your organization.
      </p>
      
      <HeroActions />
    </div>
  );
};

export default HeroContent;
