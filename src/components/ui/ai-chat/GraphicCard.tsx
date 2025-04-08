
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CardType = 'service' | 'feature' | 'pricing' | 'comparison' | 'cta';

export interface GraphicCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'minimal' | 'bordered';
  className?: string;
  type?: CardType;
}

export const GraphicCard: React.FC<GraphicCardProps> = ({
  title,
  description,
  image,
  icon,
  action,
  variant = 'default',
  className,
  type = 'feature'
}) => {
  return (
    <Card 
      className={cn(
        "h-full overflow-hidden transition-all duration-300",
        variant === 'bordered' && "border-2 hover:border-primary",
        variant === 'minimal' && "border-0 shadow-none bg-transparent",
        className
      )}
    >
      {image && (
        <div className="relative w-full h-40 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          />
        </div>
      )}
      
      <CardHeader>
        {icon && <div className="mb-2">{icon}</div>}
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        {variant !== 'minimal' && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      
      {variant === 'minimal' && (
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      )}
      
      {action && (
        <CardFooter className="pt-0">
          <button 
            onClick={action.onClick}
            className="inline-flex items-center font-medium text-primary hover:underline"
          >
            {action.label}
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GraphicCard;
