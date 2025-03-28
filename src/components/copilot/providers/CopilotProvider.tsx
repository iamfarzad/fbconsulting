
import React, { useState, createContext, useContext } from 'react';
import { CopilotKit } from '@copilotkit/react-core';

// Internal imports
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import ConnectionStatusIndicator from '@/components/ui/ConnectionStatusIndicator'; 
import type { AIMessage as ChatMessage } from '@/features/gemini/types';

// Custom hooks
import { useSystemMessage } from '../hooks/useSystemMessage';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import { useVoiceSetup } from '../hooks/useVoiceSetup';
import { useSpatialContext } from '../hooks/useSpatialContext';
import { useCopilotConfig } from '../hooks/useCopilotConfig';
import { useErrorHandling } from '../hooks/useErrorHandling';
import { useChatHistory } from '../hooks/useChatHistory';
import { useApiKeyManagement } from '../hooks/useApiKeyManagement';

// Basic Copilot Context for toggle functionality
interface CopilotContextType {
  enabled: boolean;
  toggleCopilot: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  isOpen: boolean;
  openCopilot: () => void;
  closeCopilot: () => void;
  activeProvider: string;
  setActiveProvider: (provider: string) => void;
  chatHistory: Record<string, ChatMessage[]>;
  addMessageToHistory: (provider: string, message: ChatMessage) => void;
  clearChatHistory: (provider: string) => void;
  retryConnection: () => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

interface CopilotProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ 
  children,
  apiKey: propApiKey 
}) => {
  // Basic toggle state
  const [enabled, setEnabled] = useState(false);
  const toggleCopilot = () => setEnabled(prev => !prev);

  // UI state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeProvider, setActiveProvider] = useState<string>('gemini');

  // Hooks for external data
  const { personaData } = usePersonaManagement();
  const { apiKey: contextApiKey, isLoading } = useGeminiAPI();
  
  // API key management
  const { apiKey } = useApiKeyManagement(propApiKey, contextApiKey);

  // Generate system message from persona data
  const systemMessage = useSystemMessage(personaData);

  // Handle connection status
  const {
    connectionStatus,
    connectionError,
    isConnected,
    isConnecting,
    showConnectionStatus,
    retry: retryConnection
  } = useConnectionStatus(enabled, apiKey, isLoading);

  // Initialize voice capabilities
  const { voiceEnabled } = useVoiceSetup(enabled);

  // Track spatial context
  const { spatialContext } = useSpatialContext(enabled);

  // Build copilot configuration
  const copilotConfig = useCopilotConfig(
    apiKey || '',
    systemMessage,
    voiceEnabled,
    spatialContext
  );

  // Setup error handling
  useErrorHandling(connectionStatus, connectionError);

  // Manage chat history
  const { 
    chatHistory, 
    addMessageToHistory, 
    clearChatHistory 
  } = useChatHistory();

  // UI handlers
  const openCopilot = () => setIsOpen(true);
  const closeCopilot = () => setIsOpen(false);

  // Provide the combined context value
  const contextValue = {
    enabled,
    toggleCopilot,
    isConnected,
    isConnecting,
    error: connectionError,
    isOpen,
    openCopilot,
    closeCopilot,
    activeProvider,
    setActiveProvider,
    chatHistory,
    addMessageToHistory,
    clearChatHistory,
    retryConnection
  };

  return (
    <CopilotContext.Provider value={contextValue}>
      {showConnectionStatus && enabled && (
        <ConnectionStatusIndicator 
          status={connectionStatus === 'connecting' ? 'connecting' : 
                 connectionStatus === 'connected' ? 'connected' : 'disconnected'} 
          onRetry={retryConnection}
        />
      )}
      
      {(enabled && connectionStatus === 'connected' && apiKey) ? (
        <CopilotKit {...copilotConfig}>
          {children}
        </CopilotKit>
      ) : (
        children
      )}
    </CopilotContext.Provider>
  );
};
