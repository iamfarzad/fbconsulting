
import React from 'react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

const HeroBackground = () => {
  return (
    <>
      <div className="absolute inset-0 tech-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90 z-0"></div>
      
      {/* Animated Grid Pattern - Tilted */}
      <AnimatedGridPattern
        numSquares={25}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={1}
        className={cn(
          "opacity-70 z-0",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12" // Added skew for tilt effect
        )}
      />
      
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-pulse-slow z-0"></div>
      <div 
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse-slow z-0" 
        style={{ animationDelay: '1s' }}
      ></div>
    </>
  );
};

export default HeroBackground;
