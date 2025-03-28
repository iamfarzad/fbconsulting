
import React from 'react';
import styles from './AnimatedBars.module.css';

interface AnimatedBarsProps {
  isActive: boolean;
  small?: boolean;
  className?: string;
}

export const AnimatedBars: React.FC<AnimatedBarsProps> = ({ 
  isActive, 
  small = false,
  className = ''
}) => {
  const barCount = small ? 3 : 5;
  
  return (
    <div className={`flex items-end gap-0.5 h-4 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`bg-primary w-0.5 rounded-sm transition-all ${
            isActive ? 'animate-pulse' : 'h-1'
          }`}
          style={{
            height: isActive ? `${Math.random() * 100}%` : '20%',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.3}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBars;
