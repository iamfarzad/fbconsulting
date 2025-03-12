
import React from 'react';
import { LucideIcon, Check } from 'lucide-react';

export interface BulletPointProps {
  item: string;
  index: number;
  bulletPointIcon?: LucideIcon;
  accentColor?: string;
  children?: React.ReactNode;
}

const BulletPoint: React.FC<BulletPointProps> = ({ 
  item, 
  index, 
  bulletPointIcon: Icon = Check,
  accentColor = "primary",
  children
}) => {
  // If children are provided, use them instead of item
  const content = children || item;
  
  return (
    <div className="flex items-start gap-2.5">
      <div className={`mt-0.5 p-1 rounded-full bg-${accentColor}/10 flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 text-${accentColor}`} />
      </div>
      <span className="text-sm text-white/80">{content}</span>
    </div>
  );
};

export default BulletPoint;
