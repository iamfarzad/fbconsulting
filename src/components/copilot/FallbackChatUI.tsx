import React from 'react';

interface FallbackChatUIProps {
  error: string | null;
  onRetry: () => void;
}

const FallbackChatUI: React.FC<FallbackChatUIProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            AI Assistant Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || "There was a problem connecting to the AI service. Please check your API key and network connection."}
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
          >
            Retry Connection
          </button>
          
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-colors"
          >
            Get API Key
          </a>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Need help? Check the <a href="https://ai.google.dev/docs" className="text-blue-600 hover:underline dark:text-blue-400">Gemini API documentation</a> for troubleshooting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FallbackChatUI;