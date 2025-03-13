
/**
 * Custom hook for using the Persona Management Protocol
 */

import { useCallback, useState } from 'react';
import { useMCP } from './useMCP';
import { 
  PersonaData, 
  PersonaType,
  createPersonaManagementProtocol,
  createSetCurrentPersonaMessage,
  createSetUserRoleMessage,
  createSetUserIndustryMessage,
  createSetUserTechnicalLevelMessage,
  createSetConversationContextMessage,
  createSetCurrentPageMessage,
  createDetermineOptimalPersonaMessage,
  createResetPersonaMessage
} from '../protocols/personaManagement';

// Options for initializing the hook
interface UsePersonaManagementOptions {
  initialData?: Partial<PersonaData>;
}

// Return type for the hook
interface UsePersonaManagementResult {
  personaData: PersonaData;
  setCurrentPersona: (persona: PersonaType) => void;
  setUserRole: (role: string) => void;
  setUserIndustry: (industry: string) => void;
  setUserTechnicalLevel: (level: 'beginner' | 'intermediate' | 'expert') => void;
  setConversationContext: (context: string) => void;
  setCurrentPage: (page: string) => void;
  determineOptimalPersona: () => void;
  resetPersona: () => void;
  isLoading: boolean;
  error?: string;
}

export function usePersonaManagement(
  options: UsePersonaManagementOptions = {}
): UsePersonaManagementResult {
  const protocol = createPersonaManagementProtocol(options.initialData || {});
  const [model, sendMessage] = useMCP(protocol);
  
  // Track loading state and error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Set the current persona
  const setCurrentPersona = useCallback((persona: PersonaType) => {
    sendMessage(createSetCurrentPersonaMessage(persona));
  }, [sendMessage]);

  // Set the user role
  const setUserRole = useCallback((role: string) => {
    sendMessage(createSetUserRoleMessage(role));
  }, [sendMessage]);

  // Set the user industry
  const setUserIndustry = useCallback((industry: string) => {
    sendMessage(createSetUserIndustryMessage(industry));
  }, [sendMessage]);

  // Set the user technical level
  const setUserTechnicalLevel = useCallback((level: 'beginner' | 'intermediate' | 'expert') => {
    sendMessage(createSetUserTechnicalLevelMessage(level));
  }, [sendMessage]);

  // Set the conversation context
  const setConversationContext = useCallback((context: string) => {
    sendMessage(createSetConversationContextMessage(context));
  }, [sendMessage]);

  // Set the current page
  const setCurrentPage = useCallback((page: string) => {
    sendMessage(createSetCurrentPageMessage(page));
  }, [sendMessage]);

  // Determine the optimal persona based on current data
  const determineOptimalPersona = useCallback(() => {
    sendMessage(createDetermineOptimalPersonaMessage());
  }, [sendMessage]);

  // Reset the persona to default
  const resetPersona = useCallback(() => {
    sendMessage(createResetPersonaMessage());
  }, [sendMessage]);

  return {
    personaData: model,
    setCurrentPersona,
    setUserRole,
    setUserIndustry,
    setUserTechnicalLevel,
    setConversationContext,
    setCurrentPage,
    determineOptimalPersona,
    resetPersona,
    isLoading,
    error
  };
}
