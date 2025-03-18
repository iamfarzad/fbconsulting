
import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="p-4 bg-destructive/10 rounded-lg text-destructive text-sm">
      <p className="font-medium">Error initializing AI Assistant</p>
      <p className="mt-1">{error}</p>
      <p className="mt-2 text-xs">Please check your API key configuration.</p>
    </div>
  );
};
