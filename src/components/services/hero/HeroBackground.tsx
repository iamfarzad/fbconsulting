
import React from 'react';

const HeroBackground = () => {
  return (
    <>
      <div className="absolute inset-0 tech-grid z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/90 z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-pulse-slow z-0"></div>
      <div 
        className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse-slow z-0" 
        style={{ animationDelay: '1s' }}
      ></div>
    </>
  );
};

export default HeroBackground;
