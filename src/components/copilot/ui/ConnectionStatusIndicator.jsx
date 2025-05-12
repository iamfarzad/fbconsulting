import React from 'react';

/**
 * A component that displays the connection status
 * 
 * @param {Object} props
 * @param {boolean} props.isConnected - Whether the connection is established
 * @param {boolean} props.isConnecting - Whether the connection is in progress
 * @returns {JSX.Element}
 */
export const ConnectionStatusIndicator = ({ isConnected, isConnecting }) => {
  return (
    <div className="flex items-center">
      <div 
        className={`h-2 w-2 rounded-full mr-2 ${
          isConnected 
            ? 'bg-green-500' 
            : isConnecting 
              ? 'bg-yellow-500 animate-pulse' 
              : 'bg-red-500'
        }`}
      />
      <span className="text-xs text-muted-foreground">
        {isConnected 
          ? 'Connected' 
          : isConnecting 
            ? 'Connecting...' 
            : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatusIndicator;
