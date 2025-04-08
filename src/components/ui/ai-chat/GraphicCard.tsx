
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CardType = 'info' | 'success' | 'warning' | 'error' | 'feature' | 'pricing' | 'testimonial';

interface GraphicCardProps {
  title: string;
  content: string;
  type?: CardType;
  icon?: React.ReactNode;
  className?: string;
}

export const GraphicCard: React.FC<GraphicCardProps> = ({
  title,
  content,
  icon,
  className
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphicCard;
export { CardType };
