
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat';
import LocationGreeting from './LocationGreeting';
import VoiceUI from './VoiceUI';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
    >
      <div className="container mx-auto max-w-4xl relative z-10 mt-10 md:mt-0">
        <div className="text-center mb-6">
          <LocationGreeting className="mb-2 text-muted-foreground" />
        </div>
        
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Automation Solutions
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Transform your business with intelligent automation
          </motion.p>
          
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AIChatInput />
          </motion.div>
        </div>
      </div>
      
      {/* Voice UI */}
      <VoiceUI />
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-foreground/40"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
