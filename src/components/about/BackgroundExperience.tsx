
import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { motion, useScroll, useTransform } from 'framer-motion';
import ExpertiseCard from './ExpertiseCard';
import ScrollProgress from './ScrollProgress';
import BackgroundCTA from './BackgroundCTA';
import { cardData } from './expertiseData';
import { Briefcase } from 'lucide-react';

const BackgroundExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);
  const patternRotation = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const patternScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      <ScrollProgress targetRef={containerRef} />
      
      {/* Background Elements */}
      <motion.div 
        style={{ 
          opacity: patternOpacity,
          rotate: patternRotation,
          scale: patternScale
        }}
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 pointer-events-none z-0" />
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <AnimatedText 
            text="What I Do" 
            tag="h2" 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70" 
          />
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-primary/80 to-primary/30 mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          />
          
          <AnimatedText 
            text="I help businesses use AI to get clear results. My work falls into four key areas:" 
            tag="p" 
            className="text-xl text-muted-foreground max-w-3xl mx-auto" 
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
        >
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <ExpertiseCard 
                {...card}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <BackgroundCTA />
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
