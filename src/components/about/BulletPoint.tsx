
import React from 'react';
import { LucideIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BulletPointProps {
  item?: string;
  index?: number;
  bulletPointIcon?: LucideIcon;
  accentColor?: string;
  children?: React.ReactNode;
}

const BulletPoint: React.FC<BulletPointProps> = ({ 
  item, 
  index = 0, 
  bulletPointIcon: Icon = Check,
  accentColor = "primary",
  children
}) => {
  // If children are provided, use them instead of item
  const content = children || item;
  
  return (
    <div className="flex items-start gap-2.5">
      <div className={cn(`mt-0.5 p-1 rounded-full flex-shrink-0`, {
        'bg-primary/10': accentColor === 'primary',
        'bg-[#fe5a1d]/10': accentColor === '[#fe5a1d]' || accentColor === 'orange'
      })}>
        <Icon className={cn(`w-3.5 h-3.5`, {
          'text-primary': accentColor === 'primary',
          'text-[#fe5a1d]': accentColor === '[#fe5a1d]' || accentColor === 'orange'
        })} />
      </div>
      <span className="text-sm text-white/80">{content}</span>
    </div>
  );
};

export default BulletPoint;
