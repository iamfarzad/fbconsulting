
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotPattern from './ui/dot-pattern';
import { AIChatInput } from './ui/ai-chat';
import LocationGreeting from './LocationGreeting';
import VoiceUI from './VoiceUI';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'portfolio':
        navigate('/blog');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'services':
        navigate('/services');
        break;
      case 'animated chat':
        navigate('/animated-chat');
        break;
      default:
        break;
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16 bg-white dark:bg-black"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-black/80 dark:to-black"></div>
      
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-30 pointer-events-none"></div>
      
      {/* Content */}
      <div className="container mx-auto max-w-6xl relative z-10 mt-10 md:mt-0">
        <div className="text-center mb-6">
          <LocationGreeting className="mb-2 text-black dark:text-white" />
        </div>
        
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            What can I help you automate?
          </h1>
          
          <AIChatInput />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-sm"
          >
            <button 
              onClick={() => navigate('/animated-chat')}
              className="text-black hover:underline dark:text-white text-sm"
            >
              Try our new animated chat experience →
            </button>
          </motion.div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <motion.div 
            className="text-lg text-black/70 dark:text-white/70 text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Reduce manual work, increase efficiency, and scale faster with AI-driven automation solutions tailored for your business.
          </motion.div>
        </div>
      </div>
      
      {/* Dot pattern */}
      <DotPattern 
        width={16} 
        height={16} 
        cx={8} 
        cy={8} 
        cr={1.5} 
        className="opacity-25 dark:opacity-15" 
      />
      
      {/* Voice UI */}
      <VoiceUI onCommand={handleVoiceCommand} />
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-black/20 dark:border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-black/40 dark:bg-white/40"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
