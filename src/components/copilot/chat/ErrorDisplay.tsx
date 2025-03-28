
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="p-4 bg-destructive/10 border-t border-destructive">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
