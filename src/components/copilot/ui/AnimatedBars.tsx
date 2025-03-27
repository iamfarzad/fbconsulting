import React from 'react';
import { cn } from '@/lib/utils';
import styles from './AnimatedBars.module.css';
import ErrorBoundaryWrapper from '../../ErrorBoundaryWrapper';

interface AnimatedBarsProps {
  isActive?: boolean;
  className?: string;
  small?: boolean;
}

export const AnimatedBars: React.FC<AnimatedBarsProps> = ({
  isActive = false,
  className,
  small = false
}) => {
  const baseClass = "flex space-x-1";
  const barBaseClass = "bg-current transform-gpu transition-transform duration-300";
  const barClass = small 
    ? "w-0.5 h-2"
    : "w-1 h-4";

  return (
    <ErrorBoundaryWrapper>
      <div className={cn(baseClass, className)}>
        <div 
          className={cn(
            barBaseClass, 
            barClass, 
            isActive ? styles.bar : styles.inactive
          )}
        />
        <div 
          className={cn(
            barBaseClass, 
            barClass,
            isActive ? styles.bar : styles.inactive
          )}
        />
        <div 
          className={cn(
            barBaseClass, 
            barClass,
            isActive ? styles.bar : styles.inactive
          )}
        />
      </div>
    </ErrorBoundaryWrapper>
  );
};
