
import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { motion, useScroll, useTransform } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ScrollProgress from './ScrollProgress';
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
  
  // Card appearance variants for staggered animation
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section ref={containerRef} className="relative py-16 px-4 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AnimatedText 
            text="My Background" 
            tag="h2" 
            className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground" 
          />
        </motion.div>
        
        {/* Expertise cards with staggered animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {cardData.map((card, index) => (
            <ExpertiseCard 
              key={index}
              {...card}
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <BackgroundCTA />
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
