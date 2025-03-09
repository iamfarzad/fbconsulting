
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glassmorphism?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className,
  hoverEffect = true,
  glassmorphism = true,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300 ease-in-out',
        glassmorphism ? 'frosted-glass' : 'bg-white dark:bg-gray-900 border border-border',
        hoverEffect && 'hover-glow hover:-translate-y-1',
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-teal rounded-full bg-teal/10">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-gradient-teal">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
