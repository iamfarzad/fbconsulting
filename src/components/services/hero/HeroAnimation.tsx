
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroAnimation = () => {
  return (
    <div className="lg:col-span-5 relative">
      <div className="aspect-square relative">
        <div className="absolute inset-0 rounded-2xl frosted-glass overflow-hidden">
          <div className="absolute inset-0 tech-grid opacity-30"></div>
          
          <div className="absolute inset-0">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-white"
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
              <div className="w-40 h-40 rounded-full bg-black/80 border border-white/30 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute w-8 h-8 rounded-full bg-white/80"
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
  );
};

export default HeroAnimation;
