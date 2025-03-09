
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
        glassmorphism ? 'glassmorphism' : 'bg-white dark:bg-gray-900 border border-border',
        hoverEffect && 'hover:shadow-glass-hover hover:-translate-y-1',
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-primary rounded-full bg-primary/10">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
