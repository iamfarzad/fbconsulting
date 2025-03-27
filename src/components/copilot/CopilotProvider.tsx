import React, { createContext, useState, useContext, ReactNode } from 'react';
import ErrorBoundaryWrapper from '../ErrorBoundaryWrapper';
import { GeminiCopilotProvider } from './GeminiCopilotProvider';

interface CopilotContextType {
  enabled: boolean;
  toggleCopilot: () => void;
  // Add other copilot-related state and functions as needed
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
  children: ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);

  const toggleCopilot = () => {
    setEnabled(prev => !prev);
  };

  const value = {
    enabled,
    toggleCopilot,
  };

  return (
    <CopilotContext.Provider value={value}>
      <ErrorBoundaryWrapper>
        <GeminiCopilotProvider>
          {children}
        </GeminiCopilotProvider>
      </ErrorBoundaryWrapper>
    </CopilotContext.Provider>
  );
};
