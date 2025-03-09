
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gradient-teal font-futuristic">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      
      {/* Modern decorative element */}
      <div className="flex justify-center mt-6">
        <div className="h-1 w-16 bg-gradient-to-r from-teal to-retro-pink rounded-full"></div>
      </div>
    </div>
  );
};

export default PageHeader;
