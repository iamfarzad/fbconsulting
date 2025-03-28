
import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
