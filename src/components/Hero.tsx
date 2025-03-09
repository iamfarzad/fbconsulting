
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';
import AnimatedText from './AnimatedText';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
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
      if (bgElement) {
        bgElement.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.5}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden pt-16"
    >
      {/* Background elements */}
      <div className="hero-bg absolute inset-0 opacity-20 pointer-events-none transition-transform duration-500 ease-out">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-400/20 filter blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary animate-fade-in">
          <AnimatedText 
            text="AI-Powered Business Automation" 
            tag="span"
            className="text-sm font-medium"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 overflow-hidden">
          <AnimatedText 
            text="Automate Your Business" 
            tag="span" 
            animation="text-reveal"
            className="block" 
          />
          <AnimatedText 
            text="with AI" 
            tag="span" 
            animation="text-reveal"
            delay={200}
            className="block text-gradient" 
          />
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          Reduce manual work, increase efficiency, and scale faster with AI-driven automation solutions tailored for your business.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
            <Calendar size={20} />
            Book a Free Consultation
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg flex items-center gap-1">
            Learn More
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-foreground/40"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
