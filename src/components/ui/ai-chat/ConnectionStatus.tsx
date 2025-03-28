
import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import { useChat } from '@/contexts/ChatContext';

export const ConnectionStatus: React.FC = () => {
  const { state, error } = useChat();
  const { isInitialized } = state;
  
  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500 mb-4 p-2 bg-red-50 rounded-md">
        <AlertCircle className="h-4 w-4" />
        <span>Error: {error}</span>
      </div>
    );
  }
  
  if (!isInitialized) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Connecting to AI service...</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
      <CheckCircle className="h-4 w-4" />
      <span>Connected to Gemini AI</span>
    </div>
  );
};

export default ConnectionStatus;
