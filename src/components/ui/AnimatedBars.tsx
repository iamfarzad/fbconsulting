
import React, { useEffect, useState, useRef } from 'react';

interface AnimatedBarsProps {
  isActive: boolean;
  small?: boolean;
}

export const AnimatedBars: React.FC<AnimatedBarsProps> = ({ isActive, small = false }) => {
  const [heights, setHeights] = useState<number[]>(
    Array(small ? 4 : 9).fill(33)
  );
  
  const animationRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!isActive) {
      setHeights(Array(small ? 4 : 9).fill(33));
      return;
    }
    
    let isAnimating = true;
    
    const updateHeights = () => {
      if (!isAnimating) return;
      
      setHeights(prev => 
        prev.map(() => isActive ? Math.max(33, Math.floor(Math.random() * 100)) : 33)
      );
      
      // Use consistent timing for smoother animation
      timerRef.current = setTimeout(() => {
        animationRef.current = requestAnimationFrame(updateHeights);
      }, 150); // More consistent timing
    };
    
    // Start animation with a small delay to prevent visual glitches
    const startTimeout = setTimeout(() => {
      updateHeights();
    }, 50);
    
    return () => {
      isAnimating = false;
      clearTimeout(startTimeout);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, small]);

  return (
    <div className={`flex items-end gap-[2px] ${small ? 'h-4 w-8' : 'h-8 w-20'}`}>
      {heights.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-black dark:bg-white transition-all duration-100 rounded-t-sm"
          style={{ 
            height: `${height}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};
