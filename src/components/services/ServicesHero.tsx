
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Workflow, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedText from '@/components/AnimatedText';
import { cn } from '@/lib/utils';

interface ServicesHeroProps {
  className?: string;
}

const ServicesHero: React.FC<ServicesHeroProps> = ({ className }) => {
  return (
    <section className={cn("relative py-20 overflow-hidden", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 tech-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-purple to-deep-purple/90 z-0"></div>
      
      {/* Animated glowing orb */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-teal/20 blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-retro-pink/10 blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '1s' }}></div>
      
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
            >
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-sm font-medium text-neon-white">AI-Powered Solutions</span>
            </motion.div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-futuristic mb-6 leading-tight">
              <AnimatedText 
                text="Transform Your Business" 
                className="text-neon-white block" 
                tag="span"
              />
              <AnimatedText 
                text="With Intelligent" 
                className="text-neon-white block" 
                tag="span"
                delay={100}
              />
              <AnimatedText 
                text="Automation" 
                className="text-gradient-retro block" 
                tag="span"
                delay={200}
              />
            </h1>
            
            {/* Description */}
            <p className="text-xl text-neon-white/80 mb-8 max-w-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              We build custom AI solutions that automate repetitive tasks, enhance decision-making, and drive efficiency across your organization.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              <Button size="lg" className="neo-button rounded-full">
                <Workflow className="mr-2 h-5 w-5" />
                Explore Our Services
              </Button>
              
              <Button variant="outline" size="lg" className="neo-button rounded-full">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Right side decorative element */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-square relative">
              {/* Frosted glass container */}
              <div className="absolute inset-0 rounded-2xl frosted-glass overflow-hidden">
                {/* Animated grid lines */}
                <div className="absolute inset-0 tech-grid opacity-30"></div>
                
                {/* Animated particles */}
                <div className="absolute inset-0">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-teal"
                      initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%", 
                        opacity: Math.random() * 0.5 + 0.3 
                      }}
                      animate={{ 
                        x: [null, Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        y: [null, Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        opacity: [null, Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3] 
                      }}
                      transition={{ 
                        duration: 10 + Math.random() * 20, 
                        ease: "linear", 
                        repeat: Infinity 
                      }}
                    />
                  ))}
                </div>
                
                {/* Center logo/icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0, -5, 0] 
                    }}
                    transition={{ 
                      duration: 8, 
                      ease: "easeInOut", 
                      repeat: Infinity 
                    }}
                    className="w-40 h-40 flex items-center justify-center"
                  >
                    <div className="w-40 h-40 rounded-full bg-deep-purple/80 border border-teal/30 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-teal" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Orbiting circle */}
                <motion.div 
                  className="absolute w-8 h-8 rounded-full bg-retro-pink/80"
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity
                  }}
                  style={{
                    transformOrigin: '50px 50px',
                    transform: 'translate(-50%, -50%) rotate(0deg) translateX(110px)',
                    top: '50%', 
                    left: '50%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
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
      </div>
    </section>
  );
};

export default ServicesHero;
