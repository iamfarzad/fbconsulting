
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { formatErrorMessage, logDetailedError } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorType: 'api' | 'ui' | 'unknown';
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorType: 'unknown'
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Map network/auth/timeout errors to api errors for our UI
    const errorCategory = formatErrorMessage(error).toLowerCase().includes('network') ||
                        formatErrorMessage(error).toLowerCase().includes('auth') ||
                        formatErrorMessage(error).toLowerCase().includes('timeout')
                        ? 'api' : 'unknown';
    
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true, 
      error,
      errorType: errorCategory
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    logDetailedError(error, {
      component: 'ErrorBoundary',
      errorInfo,
      errorType: this.state.errorType
    });
    
    this.setState({ errorInfo });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // Reset error state when props change if resetOnPropsChange is true
  public componentDidUpdate(prevProps: Props) {
    if (
      this.state.hasError &&
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorType: 'unknown'
      });
    }
  }

  // Allow manual reset from parent components
  public resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    });
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              {this.state.errorType === 'api' 
                ? 'API Connection Error' 
                : 'Something went wrong'}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {this.state.errorType === 'api'
                ? 'There was a problem connecting to the AI service. Please check your internet connection and API configuration.'
                : 'The application encountered an error. Please try refreshing the page.'}
            </p>
            {this.state.error && (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto text-sm mb-4">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Reload Page
              </button>
              <button
                onClick={this.resetError}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
