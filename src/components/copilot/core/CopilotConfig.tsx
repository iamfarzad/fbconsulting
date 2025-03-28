import React from 'react';

export interface CopilotConfig {
  apiKey?: string;
  baseUrl?: string;
  defaultModel?: string;
  temperature?: number;
  maxTokens?: number;
}

const defaultConfig: CopilotConfig = {
  defaultModel: 'gemini-pro',
  temperature: 0.7,
  maxTokens: 1000,
};

export const CopilotConfigContext = React.createContext<CopilotConfig>(defaultConfig);

export const CopilotConfigProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<CopilotConfig>;
}> = ({ children, config = {} }) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  return (
    <CopilotConfigContext.Provider value={mergedConfig}>
      {children}
    </CopilotConfigContext.Provider>
  );
};

export const useCopilotConfig = () => React.useContext(CopilotConfigContext);
