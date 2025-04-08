
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Define CardType as a type, not a value
export type CardType = 'info' | 'success' | 'warning' | 'error' | 'feature' | 'pricing';

interface GraphicCardProps {
  title: string;
  type?: CardType;
  variant?: 'default' | 'bordered' | 'minimal';
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const GraphicCard: React.FC<GraphicCardProps> = ({
  title,
  type = 'info',
  variant = 'default',
  className,
  icon,
  children,
}) => {
  // Generate the appropriate styling based on type and variant
  const cardStyles = cn(
    'transition-all',
    {
      'border-l-4': variant === 'bordered',
      'border-blue-500': variant === 'bordered' && type === 'info',
      'border-green-500': variant === 'bordered' && type === 'success',
      'border-yellow-500': variant === 'bordered' && type === 'warning',
      'border-red-500': variant === 'bordered' && type === 'error',
      'border-purple-500': variant === 'bordered' && type === 'feature',
      'border-teal-500': variant === 'bordered' && type === 'pricing',
      'bg-blue-50 dark:bg-blue-900/10': variant === 'default' && type === 'info',
      'bg-green-50 dark:bg-green-900/10': variant === 'default' && type === 'success',
      'bg-yellow-50 dark:bg-yellow-900/10': variant === 'default' && type === 'warning',
      'bg-red-50 dark:bg-red-900/10': variant === 'default' && type === 'error',
      'bg-purple-50 dark:bg-purple-900/10': variant === 'default' && type === 'feature',
      'bg-teal-50 dark:bg-teal-900/10': variant === 'default' && type === 'pricing',
    },
    className
  );

  return (
    <Card className={cardStyles}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default GraphicCard;
