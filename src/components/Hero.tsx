
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AIChatInput } from './ui/ai-chat';
import LocationGreeting from './LocationGreeting';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isNorwegian, setIsNorwegian] = useState(false);
  
  // Function to check if user is from Norway
  useEffect(() => {
    const checkIfNorwegian = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setIsNorwegian(data.country === 'NO');
        }
      } catch (error) {
        console.log("Location detection failed", error);
        
        // Fallback to browser language
        const userLang = navigator.language || navigator.languages?.[0];
        setIsNorwegian(userLang?.includes('nb') || userLang?.includes('nn') || userLang?.includes('no'));
      }
    };
    
    checkIfNorwegian();
  }, []);

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
            className="text-4xl md:text-5xl font-semibold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isNorwegian ? "AI Automation for Norwegian Businesses" : "AI Automation Solutions"}
          </motion.h1>
          
          <motion.p
            className="text-lg text-muted-foreground text-center max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isNorwegian 
              ? "Tailored AI solutions that comply with Norwegian regulations" 
              : "Transform your business with intelligent automation"}
          </motion.p>
          
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AIChatInput />
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
