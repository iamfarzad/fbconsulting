
import React, { useEffect, useState } from 'react';

interface ScrollProgressProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);

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
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="relative h-40 w-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-300 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-xs font-medium text-center text-primary">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ScrollProgress;
