import React from 'react';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  error?: string | null;
  onRetry?: () => void;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  status,
  error,
  onRetry
}) => {
  if (status === 'idle' || status === 'connected') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
      {status === 'connecting' ? (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Connecting to AI service...</p>
        </div>
      ) : status === 'error' ? (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="rounded-full h-5 w-5 bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Assistant Unavailable</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {error || 'Connection error'}
              </p>
            </div>
          </div>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
            >
              Retry Connection
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};
