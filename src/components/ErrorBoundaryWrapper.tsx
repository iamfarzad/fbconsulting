
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

const DefaultErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
    <AlertCircle className="h-10 w-10 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-center text-muted-foreground">
      We encountered an error. Please try refreshing the page.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Refresh
    </button>
  </div>
);

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<DefaultErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
