import React from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { apiConfig } from '@/config/api';

interface ConnectionStatusProps {
    className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className }) => {
    const { isConnected } = useConnectionStatus();
    const { geminiApiKey } = apiConfig;
    
    const isUsingRealApi = Boolean(geminiApiKey);
    
    return (
        <div className={`connection-status ${className || ''}`}>
            <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {isConnected ? (
                    isUsingRealApi ? (
                        <p>Connected to Gemini API</p>
                    ) : (
                        <p>Using production API</p>
                    )
                ) : (
                    <p>Disconnected from API</p>
                )}
            </div>
        </div>
    );
}
