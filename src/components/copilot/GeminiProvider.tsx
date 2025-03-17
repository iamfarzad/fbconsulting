
import React from 'react';
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';

interface GeminiProviderProps {
  children: React.ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  // We don't need to initialize anything here since we're using the GeminiAPI context from App.tsx
  // This component is kept for consistency with the previous structure and future enhancements
  
  return <>{children}</>;
};
