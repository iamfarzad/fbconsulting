
import React from 'react';
import { AlertCircle, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { ConnectionStatusIndicatorProps } from '@/types/chat';

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  status,
  onRetry
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'connecting':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: 'Connecting...',
          color: 'bg-yellow-500'
        };
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Connected',
          color: 'bg-green-500'
        };
      case 'disconnected':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Disconnected',
          color: 'bg-red-500'
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Unknown',
          color: 'bg-gray-500'
        };
    }
  };

  const { icon, text, color } = getStatusDisplay();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-white ${color}`}>
        {icon}
        <span className="text-sm font-medium">{text}</span>
        {status === 'disconnected' && onRetry && (
          <button 
            onClick={onRetry} 
            className="ml-2 p-1 bg-white/20 rounded-full hover:bg-white/30"
            title="Retry connection"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatusIndicator;
