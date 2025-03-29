
import React from 'react';
import { cn } from '@/lib/utils';

interface GraphicCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GraphicCard: React.FC<GraphicCardProps> = ({
  title,
  description,
  icon,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "glassmorphism-base rounded-xl border border-white/10 p-4 transition-all hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="min-w-10 mt-1">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default GraphicCard;
