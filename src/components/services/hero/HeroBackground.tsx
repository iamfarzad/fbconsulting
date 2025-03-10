
import React from 'react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

const HeroBackground = () => {
  return (
    <>
      <div className="absolute inset-0 tech-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90 z-0"></div>
      
      {/* Animated Grid Pattern - More pronounced tilt */}
      <AnimatedGridPattern
        numSquares={25}
        maxOpacity={0.08}
        duration={4}
        repeatDelay={1}
        className={cn(
          "opacity-70 z-0",
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-40%] h-[200%] skew-y-[20deg]" // Increased skew for more pronounced tilt
        )}
      />
      
      {/* Glowing orbs with more vibrant colors */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow z-0"></div>
      <div 
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl animate-pulse-slow z-0" 
        style={{ animationDelay: '1s' }}
      ></div>
      
      {/* Additional subtle elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl z-0"></div>
    </>
  );
};

export default HeroBackground;
