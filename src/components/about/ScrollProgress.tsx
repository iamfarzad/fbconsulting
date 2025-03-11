
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ScrollProgressProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      
      const element = targetRef.current;
      const elementTop = element.getBoundingClientRect().top;
      const elementHeight = element.getBoundingClientRect().height;
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the element
      let scrollProgress = 0;
      
      if (elementTop <= 0) {
        // Element top is above viewport
        const scrolled = Math.abs(elementTop);
        const totalScrollable = elementHeight - windowHeight;
        scrollProgress = Math.min(scrolled / totalScrollable, 1);
      }
      
      setProgress(scrollProgress * 100);
      
      // Animate background pattern based on scroll
      controls.start({
        opacity: 0.05 + (scrollProgress * 0.1),
        scale: 1 + (scrollProgress * 0.05),
        rotate: scrollProgress * 5
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef, controls]);

  return (
    <>
      <motion.div 
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative h-40 w-1 bg-gray-200/30 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-primary via-primary/80 to-primary/50 rounded-full transition-all duration-300 ease-out"
            style={{ height: `${progress}%` }}
            initial={{ height: "0%" }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.div 
          className="mt-2 px-2 py-1 text-xs font-medium rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
          animate={{
            scale: progress > 0 ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: progress > 0 ? 0 : 0,
            repeatType: "reverse"
          }}
        >
          {Math.round(progress)}%
        </motion.div>
      </motion.div>
    </>
  );
};

export default ScrollProgress;
