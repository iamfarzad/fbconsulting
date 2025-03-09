
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, Sparkles } from 'lucide-react';
import AnimatedText from './AnimatedText';
import Brain3D from './3d/Brain3D';
import VoiceUI from './VoiceUI';
import LocationGreeting from './LocationGreeting';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [brainCapability, setBrainCapability] = useState<string | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const bgElement = heroRef.current.querySelector('.hero-bg') as HTMLElement;
      const gridElement = heroRef.current.querySelector('.retro-grid') as HTMLElement;
      
      if (bgElement) {
        bgElement.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.5}px)`;
      }
      
      if (gridElement) {
        gridElement.style.transform = `translate(${moveX * -0.2}px, ${moveY * -0.2}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      default:
        break;
    }
  };

  const handleBrainNodeClick = (capability: string) => {
    setBrainCapability(capability);
    setTimeout(() => setBrainCapability(null), 3000);
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
    >
      {/* Background elements */}
      <div className="hero-bg absolute inset-0 retro-gradient-bg pointer-events-none transition-transform duration-500 ease-out"></div>
      
      <div className="retro-grid absolute inset-0 opacity-30 pointer-events-none transition-transform duration-500 ease-out"></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-deep-purple/80 to-transparent mix-blend-multiply pointer-events-none"></div>
      
      {/* Content */}
      <div className="container mx-auto max-w-6xl relative z-10 mt-10 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-3 py-1 rounded-full bg-teal/10 text-teal"
            >
              <span className="flex items-center text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Business Automation
              </span>
            </motion.div>
            
            <div className="mb-6">
              <LocationGreeting className="mb-2 text-neon-white" />
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-futuristic font-bold leading-tight overflow-hidden">
                <AnimatedText 
                  text="Automate Your Business" 
                  tag="span" 
                  animation="text-reveal"
                  className="block text-neon-white" 
                />
                <AnimatedText 
                  text="with AI" 
                  tag="span" 
                  animation="text-reveal"
                  delay={200}
                  className="block text-gradient-retro" 
                />
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-neon-white/80 max-w-xl mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              Reduce manual work, increase efficiency, and scale faster with AI-driven automation solutions tailored for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <Button 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg bg-teal hover:bg-teal/90 text-deep-purple shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Calendar size={20} />
                Book a Free Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg border-neon-white text-neon-white hover:bg-neon-white/10 flex items-center gap-1"
              >
                Learn More
                <ChevronRight size={18} />
              </Button>
            </div>
            
            {brainCapability && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-8 p-4 bg-deep-purple/80 border border-teal/30 rounded-lg text-neon-white"
              >
                <h3 className="text-lg font-semibold text-teal mb-1">{brainCapability}</h3>
                {brainCapability === 'Strategy' && (
                  <p>Developing custom AI roadmaps to transform your business operations.</p>
                )}
                {brainCapability === 'Design' && (
                  <p>Creating intuitive AI interfaces that feel natural to your team and customers.</p>
                )}
                {brainCapability === 'Execution' && (
                  <p>Implementing solutions that integrate seamlessly with your existing workflows.</p>
                )}
                {brainCapability === 'Analysis' && (
                  <p>Measuring and optimizing AI performance for maximum ROI.</p>
                )}
              </motion.div>
            )}
          </div>
          
          <div className="hidden lg:block">
            <Brain3D onNodeClick={handleBrainNodeClick} />
          </div>
        </div>
      </div>
      
      {/* Voice UI */}
      <VoiceUI onCommand={handleVoiceCommand} />
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-neon-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-neon-white/40"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
