
import React from 'react';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import API_CONFIG from '@/config/api';

interface ConnectionStatusProps {
  status?: 'connected' | 'connecting' | 'disconnected';
  apiUrl?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status = 'connected',
  apiUrl = API_CONFIG.BASE_URL
}) => {
  if (status === 'connected') {
    return (
      <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
        <Wifi className="h-3 w-3 mr-1 text-green-500" />
        <span>Connected to AI service</span>
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        <span>Connecting to AI service...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-xs text-muted-foreground mb-4">
      <WifiOff className="h-3 w-3 mr-1 text-red-500" />
      <span>Disconnected from AI service</span>
    </div>
  );
};

export default ConnectionStatus;
