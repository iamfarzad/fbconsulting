
import React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component that consistently applies error boundaries 
 * throughout the application.
 */
const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
