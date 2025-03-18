import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "container mx-auto px-4 md:px-6 py-6 md:py-8", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
