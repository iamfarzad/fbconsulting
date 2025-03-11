import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { motion, useScroll, useTransform } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ScrollProgress from './ScrollProgress';
import TimelineProgress from './TimelineProgress';
import BackgroundCTA from './BackgroundCTA';
import { cardData, timelinePoints } from './expertiseData';

const BackgroundExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Background pattern animation based on scroll
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);
  const patternRotation = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const patternScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  
  return (
    <section ref={containerRef} className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Scroll progress indicator */}
      <ScrollProgress targetRef={containerRef} />
      
      {/* Animated background pattern */}
      <motion.div 
        style={{ 
          opacity: patternOpacity,
          rotate: patternRotation,
          scale: patternScale
        }}
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"
      />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <AnimatedText 
          text="My Background" 
          tag="h2" 
          className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground" 
        />
        
        {/* Timeline */}
        <TimelineProgress timelinePoints={timelinePoints} />
        
        {/* Expertise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardData.map((card, index) => (
            <ExpertiseCard 
              key={index}
              index={index}
              {...card}
            />
          ))}
        </div>
        
        {/* Call to action */}
        <BackgroundCTA />
      </div>
    </section>
  );
};

export default BackgroundExperience;
