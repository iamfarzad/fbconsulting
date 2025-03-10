
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      
      {/* Simple divider */}
      <div className="flex justify-center mt-6">
        <div className="h-px w-12 bg-border"></div>
      </div>
    </div>
  );
};

export default PageHeader;
