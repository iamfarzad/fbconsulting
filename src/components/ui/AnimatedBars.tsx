
import React from 'react';

interface AnimatedBarsProps {
  isActive: boolean;
  small?: boolean;
}

export const AnimatedBars: React.FC<AnimatedBarsProps> = ({ isActive, small = false }) => {
  return (
    <div className={`flex items-end gap-[2px] ${small ? 'h-4 w-8' : 'h-8 w-20'}`}>
      {[...Array(small ? 4 : 9)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1 bg-black dark:bg-white
            transition-all duration-75 rounded-t-sm
            ${isActive ? 'animate-sound-wave' : 'h-1/3'}
          `}
          style={{ 
            height: isActive ? `${Math.random() * 100}%` : undefined,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};
