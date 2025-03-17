
import React from 'react';
import { usePersonaManagement } from '../../mcp/hooks/usePersonaManagement';

interface GeminiProviderProps {
  children: React.ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const { personaData } = usePersonaManagement();
  
  // We're using the GeminiAPIContext from App.tsx for API key management
  // This component is kept for consistency with the overall architecture
  // and to potentially add more Gemini-specific context in the future
  
  return <>{children}</>;
};
