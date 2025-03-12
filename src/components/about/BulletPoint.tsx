
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulletPointProps {
  text: string;
  className?: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text, className }) => {
  return (
    <div className={cn("flex items-start", className)}>
      <CheckCircle2 className="w-4 h-4 text-[#fe5a1d] mt-0.5 mr-2 flex-shrink-0" />
      <span className="text-muted-foreground text-sm">{text}</span>
    </div>
  );
};

export default BulletPoint;
