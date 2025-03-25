import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, className }) => {
  return (
    <div className={cn("section-heading", className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-2 h-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
    </div>
  );
};
