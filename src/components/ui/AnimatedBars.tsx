
import React, { useEffect, useState } from 'react';

interface AnimatedBarsProps {
  isActive: boolean;
  small?: boolean;
}

export const AnimatedBars: React.FC<AnimatedBarsProps> = ({ isActive, small = false }) => {
  const [heights, setHeights] = useState<number[]>(
    Array(small ? 4 : 9).fill(33)
  );
  
  useEffect(() => {
    if (!isActive) {
      setHeights(Array(small ? 4 : 9).fill(33));
      return;
    }
    
    let animationFrame: number;
    let isAnimating = true;
    
    const updateHeights = () => {
      if (!isAnimating) return;
      
      setHeights(prev => 
        prev.map(() => isActive ? Math.max(33, Math.floor(Math.random() * 100)) : 33)
      );
      
      // Use consistent timing for smoother animation
      animationFrame = requestAnimationFrame(() => {
        setTimeout(updateHeights, 150); // More consistent timing than RAF alone
      });
    };
    
    // Start animation with a small delay to prevent visual glitches
    const startTimeout = setTimeout(() => {
      updateHeights();
    }, 50);
    
    return () => {
      isAnimating = false;
      clearTimeout(startTimeout);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
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
