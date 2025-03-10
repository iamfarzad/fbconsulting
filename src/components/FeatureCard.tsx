
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
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
  glassmorphism = false,
}) => {
  return (
    <div
      className={cn(
        'rounded-md p-6 transition-all duration-300',
        glassmorphism ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white dark:bg-black border border-border',
        hoverEffect && 'hover:-translate-y-1',
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-black/5 dark:bg-white/5">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
};

export default FeatureCard;
